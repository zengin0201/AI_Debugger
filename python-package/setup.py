from setuptools import setup, find_packages

setup(
    name="zengin-ai-debugger",      
    version="1.0.1",                 
    description="Visual real-time debugger for LangChain AI agents",
    author="Alexey Borodin",
    packages=find_packages(),       
    install_requires=[
        "httpx",                     
        "langchain-core"            
    ],
    python_requires=">=3.8",
)
