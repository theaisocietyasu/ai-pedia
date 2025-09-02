from ..models.linear_regression import LinearRegressionUtility

class ModelRegistry:
    registry = {}
    def register(self, name=None):
        """Register a model class with a given name."""
        def decorator(obj):
            reg_name = name or obj.__name__
            print(f"Registering {reg_name} in ModelRegistry")
            if reg_name in self.registry:
                raise KeyError(f"{reg_name} is already registered in ModelRegistry")
            self.registry[reg_name] = obj
            return obj
        return decorator

    def get_all_models(self):
        """Retrieve all registered model classes."""
        return self.registry.keys()

    def get_model_class(self, name):
        """Retrieve a model class by its name."""
        if name not in self.registry:
            raise KeyError(f"{name} is not registered in ModelRegistry")
        return self.registry[name]


MODELS = ModelRegistry()
MODELS.register(name="Linear_Regression")(LinearRegressionUtility)

