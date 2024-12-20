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
        
        // Очистить предыдущие элементы в select
        fail_select.innerHTML = '';
        
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

document.addEventListener('DOMContentLoaded', function() {
    fetch('http://194.87.235.153/tag_api/api/tag/?format=json')
    .then(response => response.json())
    .then(data => {
        const dropdown = document.getElementById('tagSelect');
        const description = document.getElementById('descriptionSpan');
        const ago_date = document.getElementById('tag_data_time');
        const ago_phone = document.getElementById('tag_phone');
        ago_phone.style.display = "none";
        ago_date.style.display = "none";
  
        // Добавляем опцию по умолчанию
        const defaultOption = document.createElement('option');
        defaultOption.text = "Выберите тег";
        defaultOption.value = "";
        defaultOption.selected = true; // Делаем эту опцию выбранной по умолчанию
        defaultOption.disabled = true; // Делаем эту опцию недоступной для выбора
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
  let level1 = "";
  const level2 = document.getElementById('tagSelect').value;
  const comment = document.getElementById('tag_text').value;
  const fail_select = document.getElementById('fail_tag').value;
  const checkbox_fail_com = document.getElementById('checkbox_changes');

  if (checkbox_fail_com.checked){
    level1 = "#ХолостойНа2ЛТП" + ` #${fail_select} `;
  }
  
  // Формирование единого комментария
  const output = `${level1} #${level2} ${comment}`;
  document.getElementById('output').value = output; // Обновление поля "Сгенерированное обращение"
}

// Добавляем события на изменения для тега 1, тега 2 и поля комментария
document.getElementById('checkbox_text').addEventListener('change', updateGeneratedComment);
document.getElementById('tagSelect').addEventListener('change', updateGeneratedComment);
document.getElementById('tag_text').addEventListener('input', updateGeneratedComment);
document.getElementById('fail_tag').addEventListener('input', updateGeneratedComment);


//обработчик конопки копирования
document.getElementById("tag_copy").addEventListener("click", function() {
    const tag_main = document.getElementById("tagSelect").value;
    const main_text = document.getElementById("tag_text").value;
    const checkbox_fail = document.getElementById('checkbox_changes');
    const tag_phone = document.getElementById("tag_phone").value;
    const tag_data_time = document.getElementById("tag_data_time").value;
    const fail_select = document.getElementById('fail_tag').value;

    let tag_comment = `#${tag_main} ${main_text}`; // Здесь будем формировать итоговый комментарий

    if (tag_main === "аго_время") {
        const date = new Date(tag_data_time);
        const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        const formattedDate = date.toLocaleString('ru-RU', options).replace(',', '');
        tag_comment = `#${tag_main} ${formattedDate} ${main_text}`;
    } else if (tag_main === "аго_номер") {
        tag_comment = `#${tag_main} ${tag_phone} ${main_text}`;
    }

    // Проверяем состояние чекбокса и модифицируем комментарий
    if (checkbox_fail.checked) {
        tag_comment = "#ХолостойНа2ЛТП " + fail_select + tag_comment;
    }

    // Копируем итоговый комментарий в буфер обмена
    navigator.clipboard.writeText(tag_comment)
    .then(() => {
        console.log("Комментарий скопирован в буфер обмена: \n" + tag_comment);
    })
    .catch(err => {
        console.error('Ошибка копирования: ', err);
    });
});
