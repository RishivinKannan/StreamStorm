# Development Plan: StreamStorm AI Engine Module

## 1. Objective

This document outlines the architecture for a **modular and extensible AI engine** within the **StreamStorm** project.
The core design centers on the **Abstract Factory Pattern** to decouple the main application from specific AI model providers (e.g., **OpenAI**, **Ollama**).

This allows for easy swapping or addition of new providers without altering the core business logic. *Namma modular engineering, thala-level.*

---

## 2. File Structure

The AI module will be organized within the `src/Engine/StreamStorm/ai/` directory.

```
src/
└── Engine/
    └── StreamStorm/
        └── ai/
            ├── __init__.py
            ├── AIBase.py
            ├── ResponseModels.py
            ├── AgentFactory.py
            └── AI.py
```

---

## 3. Component Breakdown

Detailed plan for each file below 👇

---

### 3.1. `src/Engine/StreamStorm/ai/AIBase.py`

**Purpose:**
Defines the abstract base classes (interfaces) for all provider and factory implementations.
This ensures that any new provider adheres to a consistent API contract.

```python
# src/Engine/StreamStorm/ai/AIBase.py

class ProviderBase:
    """
    Abstract base class for an AI provider.
    """
    def generate(self):
        """
        Main generation method to be implemented by concrete providers.
        """
        raise NotImplementedError

class ModelFactory:
    """
    Abstract factory interface for creating AI models.
    """
    def create_model(self):
        """
        Factory method to be implemented by concrete factories.
        """
        raise NotImplementedError
```

---

### 3.2. `src/Engine/StreamStorm/ai/ResponseModels.py`

**Purpose:**
Defines the **Pydantic models** used to structure and validate the outputs from the AI.
This ensures predictable data structures for tasks like **message generation** and **channel naming**.

```python
# src/Engine/StreamStorm/ai/ResponseModels.py
from pydantic import BaseModel

class Messages(BaseModel):
    """
    A Pydantic model to structure generated messages.
    (Schema to be defined based on requirements)
    """
    pass

class ChannelNames(BaseModel):
    """
    A Pydantic model to structure generated channel names.
    (Schema to be defined based on requirements)
    """
    pass
```

---

### 3.3. `src/Engine/StreamStorm/ai/AgentFactory.py`

**Purpose:**
Implements the concrete factory classes for each supported AI provider (**OpenAI**, **Ollama**).
Includes a `ModelFactoryProvider` to dynamically select the correct factory at runtime based on configuration.

```python
# src/Engine/StreamStorm/ai/AgentFactory.py

from pydantic_ai.models.openai import OpenAIChatModel
# Assuming provider implementations exist
from pydantic_ai.providers.openai import OpenAIProvider
from pydantic_ai.providers.ollama import OllamaProvider
# Assuming AIBase contains the ModelFactory definition
from .AIBase import ModelFactory 

class OpenAIModelFactory(ModelFactory):
    def create_model(self, model_name):
        provider = OpenAIProvider()
        return OpenAIChatModel(model_name, provider=provider)

class OllamaModelFactory(ModelFactory):
    def create_model(self):
        provider = OllamaProvider(base_url="http://localhost:11434")
        return OpenAIChatModel("llama3", provider=provider)


class ModelFactoryProvider:
    """Returns the right factory based on provider name."""

    factories = {
        "openai": OpenAIModelFactory(),
        "ollama": OllamaModelFactory(),
    }

    @staticmethod
    def get_factory(provider_name: str) -> ModelFactory:
        provider_name = provider_name.lower()
        if provider_name not in ModelFactoryProvider.factories:
            raise ValueError(f"Unsupported provider: {provider_name}")
        return ModelFactoryProvider.factories[provider_name]
```

---

### 3.4. `src/Engine/StreamStorm/ai/AI.py`

**Purpose:**
Main service class for the AI module.
It initializes with the desired provider and provides high-level methods for business logic like generating messages and channel names.

```python
# src/Engine/StreamStorm/ai/AI.py

class AI:
    def __init__(self, provider_name: str, model_name: str = None):
        """
        Initializes the AI service with a specific provider.
        """
        # Logic to use ModelFactoryProvider to get a factory
        # and create a model instance
        pass

    def generate_random_messages(self, count: int):
        """
        Generates a list of random messages.
        """
        # Will use the initialized model and the Messages response model
        pass

    def generate_channel_names(self, topic: str):
        """
        Generates suggested channel names based on a topic.
        """
        # Will use the initialized model and the ChannelNames response model
        pass
```

---

## 4. Example Usage to be done in `AI class`

Demonstration of how an external service (like an **Agent**) uses this module to perform a task and return structured Pydantic responses.

```python
from pydantic import BaseModel
# This 'Agent' is a conceptual consumer of the factory
# from some_agent_library import Agent 
# from .AgentFactory import ModelFactoryProvider

# Define the desired output structure
class Summary(BaseModel):
    topic: str
    summary: str

# 1. Choose the factory dynamically
# Note: 'anthropic' would need to be added to ModelFactoryProvider
factory = ModelFactoryProvider.get_factory("anthropic") 

# 2. Create the model
# (Assuming create_model() signature is standardized)
model = factory.create_model() 

# 3. Run the task
# (Assuming an 'Agent' class wraps the model)
agent = Agent(model)
result = agent.run("Summarize the advantages of Python’s asyncio.", result_type=Summary)

# The 'result' is a validated Pydantic object
print(result)
```

---

## 4. The AI class will be used by StreamStorm in the following ways

```python
from Engine.StreamStorm.ai.AI import AI

# Instantiate the AI service with the desired provider
ai = AI(provider_name="openai", model_name="gpt-4o-mini")

# Generate some random messages
messages = ai.generate_random_messages(count=5)
print("Generated Messages:", messages)

# Generate channel names based on a topic
channel_names = ai.generate_channel_names(topic="AI development")
print("Suggested Channel Names:", channel_names)
```

**End of Document.**
