# 🚀 AI Visual Debugger (Chrome Extension & Web Dashboard)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)

**ENGLISH** | [РУССКИЙ](#-ai-visual-debugger-chrome-расширение-и-веб-дашборд-ru)

A lightweight Chrome Extension and zero-config local tool for real-time visualization and debugging of LangChain AI agents. Watch your data flow through Prompts, LLMs, and Parsers in a beautiful interactive graph right in your browser.

## 🌟 Architecture
Since Chrome Extensions cannot listen to local ports directly, this project uses a modern two-part system:
1. **The Relay Server (NPM):** A lightweight Node.js bridge (`cli.js`) that receives data from Python and sends it to the UI via WebSockets.
2. **The Dashboard (React):** Renders the interactive flow graph. It works as a Chrome Extension AND as a standard web page.
3. **The Plugin (`callback.py`):** Connects to your LangChain agent in Python with just a single line of code.

---

## 🚀 Quick Start Guide

### Step 1: Start the Relay Server
You don't even need to clone the repo to start the bridge! Just run our NPM package:
```bash
npx zengin-ai-debugger
```
*This will instantly start the WebSocket bridge on port 8000 and open a Web version of the dashboard in your browser.*

### Step 2: Test with the provided AI Bot
We included a ready-to-use test bot in the repository. Make sure [Ollama](https://ollama.com/) is running on your machine with the model `qwen2.5:1.5b` (or change the model inside `test_bot.py`).

1. Download `callback.py` and `test_bot.py` from this repository.
2. Open a terminal in that folder and run:
```bash
pip install httpx langchain-ollama
python test_bot.py
```
Look at your browser at `localhost:8000` — you will instantly see the agent's pipeline being drawn!

### Step 3: Install the Chrome Extension (Optional but Recommended)
Want it as a native Chrome Extension instead of a webpage?
1. Clone this repo and run `npm install` and `npm run build`.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Turn on **Developer mode** (toggle in the top right corner).
4. Click **Load unpacked** and select the `dist` folder.
5. Pin the extension to your toolbar. When you click it, the debugger will open in a new tab!

---

## 💻 How to use it in YOUR project
Want to debug your own LangChain project? It takes 3 lines of code.

1. Download the `callback.py` file and place it next to your Python script.
2. Ensure the relay server is running (`npx zengin-ai-debugger`).
3. Pass the debugger to the `config` when invoking your chain.

```python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Import the visual debugger
from callback import RealUIDebuggerCallback

async def main():
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    prompt = PromptTemplate.from_template("Write a fun fact about: {topic}")
    parser = StrOutputParser()
    
    chain = prompt | llm | parser

    # 2. Initialize the plugin connecting to your npx server
    ui_debugger = RealUIDebuggerCallback(server_url="http://localhost:8000")
    
    # 3. Pass it to the config when running!
    response = await chain.ainvoke(
        {"topic": "Space"}, 
        config={"callbacks": [ui_debugger]} 
    )
    print(response)

asyncio.run(main())
```

> ⚠️ **IMPORTANT:** The debugger works asynchronously via WebSockets. You **must** use `.ainvoke()` instead of `.invoke()` to run your chains, otherwise the data won't be streamed to the UI!


<br><br><br>

---
---

<a name="-ai-visual-debugger-chrome-расширение-и-веб-дашборд-ru"></a>

# 🚀 AI Visual Debugger (Chrome-расширение и Веб-дашборд) (RU)

Легковесный инструмент для отладки ИИ-агентов (LangChain) в реальном времени. Хватит читать логи в консоли — смотрите, как данные проходят через промпты, нейросети и парсеры на красивом графе прямо в браузере.

## 🌟 Как это работает
Так как расширения Chrome не могут напрямую слушать порты, мы используем современный подход:
1. **Сервер-мост (NPM):** Легковесный Node.js скрипт (`cli.js`), который тихо работает в фоне, получает POST-запросы от Python и пересылает их в UI по WebSockets.
2. **Дашборд (React):** Отрисовывает интерактивный граф. Работает и как Chrome-расширение, и как обычный сайт.
3. **Плагин (`callback.py`):** Подключается к вашему LangChain агенту одной строчкой кода.

---

## 🚀 Пошаговая инструкция

### Шаг 1: Запуск сервера-моста
Вам даже не нужно клонировать репозиторий, чтобы запустить интерфейс! Просто выполните команду в любом терминале:
```bash
npx zengin-ai-debugger
```
*Это мгновенно запустит WebSocket-мост на порту 8000 и откроет веб-версию дашборда в вашем браузере.*

### Шаг 2: Тест готового бота
Мы подготовили тестового бота. Убедитесь, что у вас запущена локальная [Ollama](https://ollama.com/) с моделью `qwen2.5:1.5b` (или измените модель внутри `test_bot.py`).

1. Скачайте файлы `callback.py` и `test_bot.py` из этого репозитория.
2. Откройте новый терминал в этой папке и запустите:
```bash
pip install httpx langchain-ollama
python test_bot.py
```
Посмотрите в браузер на `localhost:8000` — шаги агента, его входы и выходы мгновенно отрисуются в реальном времени!

### Шаг 3: Установка Chrome-расширения (Опционально)
Хотите использовать инструмент как нативное расширение Chrome?
1. Склонируйте этот репозиторий, выполните `npm install` и `npm run build`.
2. Откройте Google Chrome и перейдите по адресу `chrome://extensions/`.
3. Включите **Режим разработчика**.
4. Нажмите **Загрузить распакованное расширение** и выберите папку `dist`.
5. Закрепите расширение. При клике на иконку дашборд будет удобно открываться в новой вкладке!

---

## 💻 Как внедрить это в ВАШ проект
Хотите дебажить собственный LangChain код? Это займет 3 строчки.

1. Скачайте файл `callback.py` и положите рядом со своим Python-скриптом.
2. Убедитесь, что мост работает (`npx zengin-ai-debugger`).
3. Передайте дебаггер в `config` при запуске цепочки.

```python
import asyncio
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 1. Импортируем визуальный отладчик
from callback import RealUIDebuggerCallback

async def main():
    llm = ChatOpenAI(model="gpt-3.5-turbo")
    prompt = PromptTemplate.from_template("Напиши факт про: {topic}")
    parser = StrOutputParser()
    
    chain = prompt | llm | parser

    # 2. Инициализируем плагин, подключаясь к npx серверу
    ui_debugger = RealUIDebuggerCallback(server_url="http://localhost:8000")
    
    # 3. Передаем его в config при запуске!
    response = await chain.ainvoke(
        {"topic": "Космос"}, 
        config={"callbacks": [ui_debugger]} 
    )
    print(response)

asyncio.run(main())
```

> ⚠️ **ОЧЕНЬ ВАЖНО:** Дебаггер работает асинхронно через WebSockets. Для запуска ваших цепочек вы **обязательно** должны использовать метод `.ainvoke()` вместо `.invoke()`, иначе данные не поступят в интерфейс!
