from setuptools import setup, find_packages

setup(
    name="zengin-ai-debugger",       # Имя, которое будут писать в pip install
    version="1.0.1",                 # Версия пакета
    description="Visual real-time debugger for LangChain AI agents",
    author="Alexey Borodin",
    packages=find_packages(),        # Автоматически найдет папку zengin_ai_debugger
    install_requires=[
        "httpx",                     # Твой код использует httpx
        "langchain-core"             # Твой код использует базовые классы LangChain
    ],
    python_requires=">=3.8",
)