# 🚀 Zengin AI Debugger (Visual LangChain Debugger)

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-blue.svg)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://www.python.org/)
[![npm version](https://img.shields.io/npm/v/zengin-ai-debugger.svg?color=blue)](https://www.npmjs.com/package/zengin-ai-debugger)
[![PyPI version](https://img.shields.io/pypi/v/zengin-ai-debugger.svg?color=blue)](https://pypi.org/project/zengin-ai-debugger/)

**ENGLISH** | [РУССКИЙ](#-zengin-ai-debugger-визуальный-отладчик-для-langchain-ru)

Stop reading endless console logs! This tool lets you see how your AI agent thinks **in real-time**. Data, prompts, LLMs, and parsers will be rendered as a beautiful interactive graph right in your browser.

This guide is written as simply as possible so absolutely anyone can run it! ☕️

<img width="800" height="450" alt="Zengin AI Debugger Demo" src="https://github.com/user-attachments/assets/4a35530f-52d6-4127-967b-5485f4ed2999" />

## ✨ Key Features
* ⚡ **Real-time Visualization:** Watch your LangChain graph build itself dynamically as the agent runs.
* 💰 **Cost & Token Tracking:** Automatically calculates token usage and estimated costs for LLM calls.
* 🛡️ **PII Masking:** Automatically hides sensitive data (emails, credit cards) from the debugger UI for security.
* 🔍 **Deep Inspection:** Click on any node to see exact Inputs, Outputs, execution time, and Error Stack Traces.
* 🔄 **Universal:** Works perfectly with both synchronous (`.invoke()`) and asynchronous (`.ainvoke()`) chains.

---

## 🛠 How does it work?
The system consists of two parts that communicate with each other:
1. **The Dashboard (Browser UI)** — installed via `npm` (Node.js). It draws the visual graph.
2. **The Plugin (Python)** — installed via `pip`. It intercepts data from LangChain and sends it to the Dashboard.

---

## 🚀 Quick Start (1-Click Run)
If you don't want to type commands manually, just clone/download this repository and run the startup script:
- **For Windows:** Double-click on the `start.bat` file.
- **For Mac/Linux:** Run `./start.sh` in your terminal.

The script will automatically check for Node.js/Python, install the necessary packages, and launch the bridge server!

---

## 📖 Manual Step-by-step Guide

### Step 1: Install and run the Dashboard (UI)
*You must have [Node.js](https://nodejs.org/) installed on your computer for this step.*

Open your terminal and run this command for global installation:
```bash
npm install -g zengin-ai-debugger
```

Once the installation is complete, simply type in your terminal to start the UI server:
```bash
zengin-ai-debugger
```
🎉 **Done!** The bridge server is running. A web page will open in your browser at `http://localhost:8000`. **Do not close this terminal while debugging.**

*(Alternative: if you don't want to install anything globally, you can just run `npx zengin-ai-debugger`).*

### Step 2: Install the Python library in your project
Open a **second** terminal in your Python project folder and install our plugin from PyPI:
```bash
pip install zengin-ai-debugger
```

*(Make sure you also have the base libraries installed: `pip install langchain-core requests`)*

### Step 3: Inject the debugger into your code (just 3 lines!)
Now let's add the magic to your code. Open your Python file containing the LangChain agent.

Here is a ready-to-use example:

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 👉 1. IMPORT OUR PLUGIN
from zengin_ai_debugger import RealUIDebuggerCallback

# Create a standard LangChain sequence
llm = ChatOpenAI(model="gpt-3.5-turbo")
prompt = PromptTemplate.from_template("Write a fun fact about: {topic}")
parser = StrOutputParser()

chain = prompt | llm | parser

# 👉 2. INITIALIZE THE DEBUGGER
# By default, it sends data to http://localhost:8000
ui_debugger = RealUIDebuggerCallback()

print("Launching agent... Look at your browser!")

# 👉 3. PASS THE DEBUGGER TO THE CONFIG WHEN RUNNING
response = chain.invoke(
    {"topic": "Capybaras"}, 
    config={"callbacks": [ui_debugger]} 
)

print("Response received:", response)
```
*(Note: The debugger works seamlessly with both synchronous `chain.invoke()` and asynchronous `await chain.ainvoke()` methods!)*

---

## 🎮 How to use the interface
1. Run `zengin-ai-debugger` in the first terminal.
2. Open `http://localhost:8000` in your browser.
3. Run your Python script in the second terminal.
4. Blocks (Nodes) will start appearing in your browser.
5. **Click on any block** to open the side panel. There you will see the exact text that entered this block (Input) and the text the block produced (Output).
6. Click the **"Clear screen"** button to clear the canvas before your next run.

---

## 🧩 Using as a Chrome Extension (Optional)
Now the debugger works as a true browser extension! To install it:
1. Clone this repository to your PC: `git clone https://github.com/zengin0201/AI_Debugger.git`
2. Run `npm install` and then `npm run build` inside the folder. This will create a `dist` directory.
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Turn on **Developer mode** (toggle in the top right corner).
5. Click **Load unpacked** and select the generated `dist` folder.
6. Pin the extension icon. Now, whenever you click it, the debugger will automatically open in a new full-screen tab!

*(Note: The bridge server `zengin-ai-debugger` must still be running in your terminal to receive data).*

<br><br><br>

---
---

<a name="-zengin-ai-debugger-визуальный-отладчик-для-langchain-ru"></a>

# 🚀 Zengin AI Debugger (Визуальный отладчик для LangChain) [RU]

Хватит читать бесконечные логи в консоли! Этот инструмент позволяет вам **в реальном времени** видеть, как ваш ИИ-агент думает. Данные, промпты, нейросети и парсеры будут отрисовываться в виде красивого интерактивного графа прямо в вашем браузере.

Инструкция написана максимально просто, чтобы запустить инструмент смог каждый! ☕️

## ✨ Главные фишки
* ⚡ **Рендеринг в реальном времени:** Наблюдайте, как граф LangChain строится прямо во время работы агента.
* 💰 **Подсчет токенов и стоимости:** Автоматически считает потраченные токены и примерную стоимость запросов к LLM.
* 🛡️ **Защита данных (PII Masking):** Скрывает конфиденциальные данные (email, номера кредитных карт) в интерфейсе отладчика.
* 🔍 **Глубокая инспекция:** Кликните на любой узел, чтобы увидеть точные Input/Output, время выполнения и трейсы ошибок.
* 🔄 **Универсальность:** Отлично работает как с синхронными (`.invoke()`), так и с асинхронными (`.ainvoke()`) цепочками.

---

## 🛠 Как это работает?
Система состоит из двух частей, которые общаются друг с другом:
1. **Дашборд (Интерфейс в браузере)** — устанавливается через `npm` (Node.js). Он рисует граф.
2. **Плагин (Python)** — устанавливается через `pip`. Он перехватывает данные из LangChain и отправляет их в Дашборд.

---

## 🚀 Самый быстрый старт (Запуск в 1 клик)
Если вы не хотите вводить команды вручную, просто скачайте (или склонируйте) этот репозиторий и запустите скрипт:
- **Для Windows:** Кликните два раза по файлу `start.bat`
- **Для Mac/Linux:** Выполните в терминале `./start.sh`

Скрипт сам проверит наличие Node.js и Python, установит нужные пакеты и запустит сервер интерфейса!

---

## 📖 Ручная пошаговая инструкция

### Шаг 1: Установка и запуск Интерфейса (Дашборда)
*Для этого шага на вашем компьютере должен быть установлен [Node.js](https://nodejs.org/).*

Откройте терминал (командную строку) и введите команду для глобальной установки:
```bash
npm install -g zengin-ai-debugger
```

После завершения установки просто напишите в терминале:
```bash
zengin-ai-debugger
```
🎉 **Готово!** Сервер запущен. У вас в браузере автоматически откроется страница `http://localhost:8000`. **Не закрывайте этот терминал, пока отлаживаете агентов.**

*(Альтернатива: если не хотите ничего устанавливать глобально, можно просто запустить `npx zengin-ai-debugger`).*

### Шаг 2: Установка Python-библиотеки в ваш проект
Откройте **второй** терминал в папке с вашим Python-проектом и установите наш плагин из PyPI:
```bash
pip install zengin-ai-debugger
```

*(Убедитесь, что у вас также установлены базовые библиотеки: `pip install langchain-core requests`)*

### Шаг 3: Внедряем отладчик в ваш код (всего 3 строчки!)
Теперь добавим магию в ваш код. Откройте ваш Python-файл с LangChain агентом. 

Вот готовый пример того, как это делается:

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

# 👉 1. ИМПОРТИРУЕМ НАШ ПЛАГИН
from zengin_ai_debugger import RealUIDebuggerCallback

# Создаем стандартную цепочку LangChain
llm = ChatOpenAI(model="gpt-3.5-turbo")
prompt = PromptTemplate.from_template("Напиши забавный факт про: {topic}")
parser = StrOutputParser()

chain = prompt | llm | parser

# 👉 2. СОЗДАЕМ ОТЛАДЧИК
# Он по умолчанию будет слать данные на http://localhost:8000
ui_debugger = RealUIDebuggerCallback()

print("Запускаем агента... Смотрите в браузер!")

# 👉 3. ПЕРЕДАЕМ ОТЛАДЧИК В CONFIG ПРИ ЗАПУСКЕ
response = chain.invoke(
    {"topic": "Капибары"}, 
    config={"callbacks": [ui_debugger]} 
)

print("Ответ получен:", response)
```
*(Примечание: Отладчик отлично работает как с синхронным запуском `chain.invoke()`, так и с асинхронным `await chain.ainvoke()`!)*

---

## 🎮 Как пользоваться интерфейсом
1. Запустили `zengin-ai-debugger` в первом терминале.
2. Открыли `http://localhost:8000` в браузере.
3. Запустили ваш Python-скрипт во втором терминале.
4. В браузере начнут появляться блоки (Ноды).
5. **Кликните на любой блок**, чтобы справа открылась панель. Там вы увидите, какой именно текст вошел в этот блок (Input) и какой текст блок выдал в качестве результата (Output).
6. Нажмите кнопку **"Clear screen"**, чтобы очистить холст перед следующим запуском.

---

## 🧩 Использование в виде Chrome-расширения (Опционально)
Теперь отладчик работает как полноценное расширение! Чтобы установить его:
1. Склонируйте этот репозиторий: `git clone https://github.com/zengin0201/AI_Debugger.git`
2. Выполните внутри команду `npm install` и затем `npm run build`. Это создаст папку `dist`.
3. Откройте Google Chrome и перейдите по адресу `chrome://extensions/`.
4. Включите **Режим разработчика** (тумблер справа сверху).
5. Нажмите **Загрузить распакованное расширение** и выберите созданную папку `dist`.
6. Закрепите иконку расширения. Теперь по одному клику на нее интерфейс отладчика будет автоматически открываться в новой вкладке!

*(Внимание: Сервер моста `zengin-ai-debugger` всё равно должен быть запущен в терминале для получения данных от агентов).*
