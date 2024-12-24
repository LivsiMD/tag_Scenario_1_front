//Обработка Select с ошибкой 1 ЛТП (Холостой на 2 ЛТП)
document.addEventListener('DOMContentLoaded', function() {
    loadData();

    const checkbox_fail_viem = document.getElementById('checkbox_changes');
    checkbox_fail_viem.addEventListener('change', toggleSelect); // Привязываем обработчик к чекбоксу
});

function toggleSelect() {
    const checkbox_fail_viem = document.getElementById('checkbox_changes');
    const fail_select = document.getElementById('fail_tag');
    console.log(fail_select);
    console.log(checkbox_fail_viem);
    console.log('Checkbox checked:', checkbox_fail_viem.checked);

    // Управляем только видимостью селекта в зависимости от состояния чекбокса
    if (checkbox_fail_viem.checked) {
        console.log('Displaying select');
        fail_select.style.display = 'block'; // Показываем селект
    } else {
        console.log('Hiding select');
        fail_select.style.display = 'none'; // Скрываем селект
    }
}

async function loadData() {
    const fail_select = document.getElementById('fail_tag');
    
    try {
        const response = await fetch('http://194.87.235.153/tag_api/api/tag/?format=json');
        const data = await response.json();
        
        // Добавляем опцию по умолчанию
        const defaultOption = document.createElement('option');
        defaultOption.text = "Выберите холостой тег";
        defaultOption.value = "";
        defaultOption.selected = true; // Делаем эту опцию выбранной по умолчанию
        fail_select.add(defaultOption);
        
        // Добавляем только те значения, где столбец "fault" (булевое значение) равно TRUE
        data.forEach(item => {
            if (item.fault === true) {
                const option = document.createElement('option');
                option.value = item.main_text; // Значение для выбора из второго столбца
                option.textContent = item.main_text; // Текст отображаемый в списке
                fail_select.appendChild(option);
            }
        });
        
    } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
    }
}

// Обработчик для Select с ошщим тегом
document.addEventListener('DOMContentLoaded', function() {
    fetch('http://194.87.235.153/tag_api/api/tag/?format=json')
    .then(response => response.json())
    .then(data => {
        const dropdown = document.getElementById('tagSelect');
        const description = document.getElementById('descriptionSpan');
        const ago_date = document.getElementById('tag_data_time');
        const ago_phone = document.getElementById('tag_phone');
        const sale_name = document.getElementById('sale_name');
        ago_phone.style.display = "none";
        ago_date.style.display = "none";
        sale_name.style.display = "none";
  
        // Добавляем опцию по умолчанию
        const defaultOption = document.createElement('option');
        defaultOption.text = "Выберите базовый тег";
        defaultOption.value = "";
        defaultOption.selected = true; // Делаем эту опцию выбранной по умолчанию
        dropdown.add(defaultOption);
  
        // Заполнение выпадающего списка
        data.forEach(item => {
            if (item.fault === false) { // Проверяем условие
                const option = document.createElement('option');
                option.setAttribute("id", "tag_option");
                option.text = item.main_text;
                option.value = item.main_text;
                dropdown.add(option);
            }
        });
  
        dropdown.addEventListener('change', function() {
            const selectedId = this.value; // Получаем id выбранного элемента
            const selectedTag = data.find(item => item.main_text === selectedId); // Находим выбранный элемент по id
  
            if (selectedTag) { // Проверяем, найден ли элемент
                description.textContent = selectedTag.off_text || 'Описание не найдено'; // Описание из off_text или дефолтное сообщение
  
                // Добавление поля ввода в зависимости от выбранного элемента
                if (selectedTag.main_text === "аго_время" || selectedTag.main_text === "длительный_дозвон") {
                    ago_date.style.display = "block"; // Показать элемент для ввода даты и времени
                } else {
                    ago_date.style.display = "none"; // Скрыть элемент для ввода даты и времени
                }
  
                if (selectedTag.main_text === "аго_номер") {
                    ago_phone.style.display = "block"; // Показать элемент для ввода номера телефона
                } else {
                    ago_phone.style.display = "none"; // Скрыть элемент для ввода номера телефона
                }

                if (selectedTag.main_text === "продажа2ЛТП") {
                    sale_name.style.display = "block";
                } else {
                    sale_name.style.display = "none";
                }
            } else {
                // Если выбранный элемент не найден, очищаем описание и скрываем поля
                description.textContent = 'Выберите тег'; // Сообщение по умолчанию
                ago_date.style.display = "none";
                ago_phone.style.display = "none";
            }
        });
    })
    .catch(error => console.error('Error:', error));
  });

//обработчик Сгенерированого комментария
function updateGeneratedComment() {
  let level1 = document.getElementById('fail_tag').value;;
  let level2 = document.getElementById('tagSelect').value;
  const comment = document.getElementById('tag_text').value;
  const fail_select = document.getElementById('fail_tag').value;
  const checkbox_fail_com = document.getElementById('checkbox_changes');
  const tag_data_time = document.getElementById("tag_data_time").value;
  const date = new Date(tag_data_time);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  const formattedDate = date.toLocaleString('ru-RU', options).replace(',', '');
  const tag_phone = document.getElementById("tag_phone").value;
  const sale_name = document.getElementById('sale_name').value;

  // Обработка level1, если чекбокс установлен
  if (checkbox_fail_com.checked && level1 !== "") {
    level1 = `#ХолостойНа2ЛТП #${fail_select}`;
  }

  // Обработка level2
  if (level2 === "аго_время") {
    level2 = `${level2} ${formattedDate}`;
  } else if (level2 === "аго_номер") {
    level2 = `${level2} ${tag_phone}`;
  } 

 // Формирование итогового комментария
let output;


if (checkbox_fail_com.checked && level2 !== "" && level1 === "") {
    output = "Не выбран холостой тег"; // Вывод ошибки
  }
// Если чекбокс установлен и level2 пустой
else if (checkbox_fail_com.checked && level2 === "") {
  if (level1 === "") {
    output = "Не выбраны теги"; // Ошибка, если level1 тоже пустой
  } else {
    output = `${level1} ${comment}`; // Если level1 заполнен, формируем комментарий
  }
} 
else if (checkbox_fail_com.checked && level1 !== "") {
    if (level2 === "продажа2ЛТП") {
        output = `${level1} #${level2} ${comment} ФИО агента:${sale_name} Требуется на выезд взять с собой и при устранении проблемы установить и настроить это оборудование и заполнить документы для продажи 2ЛТП. Тип реализации (продажа).`;
    }
    else if (level2 !== "") {
        output = `${level1} #${level2} ${comment}`;
    }
  }
// Если чекбокс не установлен, а оба level пустые
else if (!checkbox_fail_com.checked && level2 === "" && level1 === "") {
  output = "Не выбраны теги"; // Общая ошибка
} 
// Если чекбокс не установлен и level2 не пустой
else if (!checkbox_fail_com.checked) {
  if (level2 === "продажа2ЛТП") {
    output = `#${level2} ${comment} ФИО агента:${sale_name} Требуется на выезд взять с собой и при устранении проблемы установить и настроить это оборудование и заполнить документы для продажи 2ЛТП. Тип реализации (продажа).`;
  }
  else if (level2 === "" && level1 !== "") {
    output = `Не выбраны теги`;
  }
  else if (level2 !== "") {
    output = `#${level2} ${comment}`; // Формируем комментарий с level2
  }
} 
// Любой другой случай (например, если level2 заполнен)
else {
  output = `${level1} ${comment}`; // Используем level1 и комментарий
} 

  document.getElementById('output').value = output; // Обновление поля "Сгенерированное обращение"
}

// Добавляем события на изменения для тега 1, тега 2 и поля комментария
document.getElementById('checkbox_text').addEventListener('change', updateGeneratedComment);
document.getElementById('tagSelect').addEventListener('change', updateGeneratedComment);
document.getElementById('tag_text').addEventListener('input', updateGeneratedComment);
document.getElementById('fail_tag').addEventListener('input', updateGeneratedComment);
document.getElementById('tag_data_time').addEventListener('input', updateGeneratedComment);
document.getElementById('tag_phone').addEventListener('input', updateGeneratedComment);
document.getElementById('sale_name').addEventListener('input', updateGeneratedComment);


// Обработчик кнопки копирования
document.getElementById("tag_copy").addEventListener("click", function () {
    const tag_main = document.getElementById("tagSelect").value.trim();
    const main_text = document.getElementById("tag_text").value.trim();
    const checkbox_fail = document.getElementById('checkbox_changes');
    const tag_phone = document.getElementById("tag_phone").value.trim();
    const tag_data_time = document.getElementById("tag_data_time").value.trim();
    const fail_select = document.getElementById('fail_tag').value.trim();
    const sale_name = document.getElementById('sale_name').value.trim();
    const messageElement = document.getElementById("message");

    let tag_comment = ""; // Итоговый комментарий

    try {
        // Формирование комментария на основе основного тега
        switch (tag_main) {
            case "аго_время":
                if (tag_data_time) {
                    const date = new Date(tag_data_time);
                    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
                    const formattedDate = date.toLocaleString('ru-RU', options).replace(',', '');
                    tag_comment = `#${tag_main} ${formattedDate} ${main_text}`;
                } else {
                    alert("Ошибка: Не указана дата и время.");
                    return;
                }
                break;

            case "аго_номер":
                if (tag_phone) {
                    tag_comment = `#${tag_main} ${tag_phone} ${main_text}`;
                } else {
                    alert("Ошибка: Не указан номер телефона.");
                    return;
                }
                break;

            case "продажа2ЛТП":
                if (sale_name) {
                    tag_comment = `#${tag_main} ФИО агента: ${sale_name}. Требуется на выезд взять с собой ${main_text}, устранить проблему, установить и настроить оборудование, заполнить документы. Тип реализации: продажа.`;
                } else {
                    alert("Ошибка: Не указано имя агента.");
                    return;
                }
                break;

            default:
                tag_comment = tag_main ? `#${tag_main} ${main_text}` : "";
                break;
        }

        // Если чекбокс включен, добавляем холостой тег
        if (checkbox_fail.checked) {
            if (!fail_select && !tag_main) {
                alert("Не выбраны теги");
                return;
            } else if (!fail_select) {
                alert("Ошибка: Не выбран холостой тег.");
                return;
            }
            tag_comment = `#ХолостойНа2ЛТП #${fail_select} ${main_text}`;
        } else if (!tag_main) {
            alert("Ошибка: Не выбран основной тег.");
            return;
        }

        // Копируем комментарий в буфер обмена
        navigator.clipboard.writeText(tag_comment)
            .then(() => {
                console.log("Комментарий успешно скопирован: \n" + tag_comment);
                messageElement.textContent = "Комментарий успешно скопирован!";
                messageElement.style.display = "block";
            })
            .catch(err => {
                console.error("Ошибка копирования в буфер обмена: ", err);
                alert("Ошибка копирования в буфер обмена.");
            });

    } catch (error) {
        console.error("Произошла ошибка: ", error);
        alert("Произошла ошибка при обработке. Проверьте данные.");
    }
});
