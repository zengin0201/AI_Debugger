from setuptools import setup, find_packages

setup(
    name="zengin_ai_debugger",       # Имя, которое будут писать в pip install
    version="1.0.7",                 # Версия пакета
    description="Visual real-time debugger for LangChain AI agents",
    author="Alexey Borodin",
    packages=["zengin_ai_debugger"], 
    package_dir={"zengin_ai_debugger": "python-package"},            # Автоматически найдет папку zengin_ai_debugger
    install_requires=[
        "requests",                     # Твой код использует httpx
        "langchain-core"             # Твой код использует базовые классы LangChain
    ],
    python_requires=">=3.8",
)