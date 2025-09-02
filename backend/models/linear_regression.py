import torch

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

    learning_rate = 0.01


    @staticmethod
    def create_model(input_dim, output_dim):
        return LinearRegressionModel(input_dim, output_dim)

    @staticmethod
    def get_model_state(model):
        return model.state_dict()

    @staticmethod
    def get_criterion(criterion_choice):
        for name, criterion in LinearRegressionUtility.criterion_options:
            if name == criterion_choice:
                return criterion()
        raise ValueError(f"Criterion '{criterion_choice}' not found.")

    @staticmethod
    def get_optimizer(optimizer_choice, model_parameters):
        for name, optimizer in LinearRegressionUtility.optimizer_options:
            if name == optimizer_choice:
                return optimizer(model_parameters, lr=LinearRegressionUtility.learning_rate)
        raise ValueError(f"Optimizer '{optimizer_choice}' not found.")

    @staticmethod
    def train_model(model, train_loader, criterion_choice, optimizer_choice, num_epochs):
        model.train()
        try:
            criterion = LinearRegressionUtility.get_criterion(criterion_choice)
            optimizer = LinearRegressionUtility.get_optimizer(optimizer_choice, model.parameters())
        except ValueError as e:
            return e
        for epoch in range(num_epochs):
            for inputs, targets in train_loader:
                optimizer.zero_grad()
                outputs = model(inputs)
                loss = criterion(outputs, targets)
                loss.backward()
                optimizer.step()
        return model

    @staticmethod
    def get_prediction(model, _input):
        model.eval()
        with torch.no_grad():
            prediction = model(_input)
        return prediction