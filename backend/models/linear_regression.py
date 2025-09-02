import asyncio
from fastapi import WebSocketDisconnect
import torch
from torch.utils.data import DataLoader, TensorDataset

class LinearRegressionModel(torch.nn.Module):
    def __init__(self, input_dim, output_dim):
        super(LinearRegressionModel, self).__init__()
        self.linear = torch.nn.Linear(input_dim, output_dim)

    def forward(self, x):
        return self.linear(x)

class LinearRegressionUtility:

    criterion_options = [
        ('Mean Squared Error', torch.nn.MSELoss),
        ('Mean Absolute Error', torch.nn.L1Loss),
        ('Huber Loss', torch.nn.HuberLoss)
    ]

    optimizer_options = [
        ('Stochastic Gradient Descent', torch.optim.SGD),
        ('Adam', torch.optim.Adam),
        ('AdamW', torch.optim.AdamW)
    ]

    def __init__(self) -> None:
        self.model = None

        self.learning_rate = 0.01

        self.ws_clients = set()

        self.dataloader = None

        self.criterion = None
        self.optimizer = None

    def add_client(self, client):
        self.ws_clients.add(client)

    def create_model(self, input_dim, output_dim):
        self.model = LinearRegressionModel(input_dim, output_dim)

    def get_model_state(self):
        return self.model.state_dict()
    
    def set_settings(self, learning_rate, input_data, output_data, criterion_choice):
        self.learning_rate = learning_rate
        dataset = TensorDataset(torch.tensor(input_data, dtype=torch.float32).unsqueeze(1),
                                torch.tensor(output_data, dtype=torch.float32).unsqueeze(1))
        self.dataloader = DataLoader(dataset)
        self.criterion = self.get_criterion(criterion_choice)

    def get_criterion(self, criterion_choice):
        for name, criterion in self.criterion_options:
            if name == criterion_choice:
                return criterion()
        raise ValueError(f"Criterion '{criterion_choice}' not found.")
        
    def get_optimizer(self, optimizer_choice, model_parameters):
        for name, optimizer in self.optimizer_options:
            if name == optimizer_choice:
                return optimizer(model_parameters, lr=self.learning_rate)
        raise ValueError(f"Optimizer '{optimizer_choice}' not found.")

    async def train_model(self, input_dim, output_dim, optimizer_choice, num_epochs, stream_data=False):
        if self.model is None:
            self.create_model(input_dim=1, output_dim=1)
        self.model.train()
        try:
            criterion = self.criterion
            optimizer = self.get_optimizer(optimizer_choice, self.model.parameters())
        except ValueError as e:
            return e
        for epoch in range(num_epochs):
            for inputs, targets in self.dataloader:
                optimizer.zero_grad()
                outputs = self.model(inputs)
                loss = criterion(outputs, targets)
                loss.backward()
                optimizer.step()

            if stream_data:
                payload = {
                    "epoch": epoch + 1,
                    "loss": loss.item(),
                    "w": self.model.linear.weight.data.tolist(),
                    "b": self.model.linear.bias.data.tolist()
                }

                dead = []

                for client in self.ws_clients:
                    try:
                        await client.send_json(payload)
                    except WebSocketDisconnect:
                        dead.append(client)

                for d in dead:
                    self.ws_clients.remove(d)

                await asyncio.sleep(0.1)

    @staticmethod
    def get_prediction(model, _input):
        model.eval()
        with torch.no_grad():
            prediction = model(_input)
        return prediction