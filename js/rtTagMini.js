document.addEventListener('DOMContentLoaded', function() {
  fetch('http://194.87.235.153:8000/tag_api/api/tag/?format=json')
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
          const option = document.createElement('option');
          option.setAttribute("id", "tag_option");
          option.text = item.main_text;
          option.value = item.main_text;
          dropdown.add(option);
      });

      dropdown.addEventListener('change', function() {
          const selectedId = this.value; // Получаем id выбранного элемента
          const selectedDescription = data.find(item => item.main_text === selectedId).off_text;
          description.textContent = selectedDescription;

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
  const checkbox_fail_com = document.getElementById('checkbox_changes');

  if (checkbox_fail_com.checked){
    level1 = "#ХолостойНа2ЛТП";
  }
  
  // Формирование единого комментария
  const output = `${level1} #${level2} ${comment}`;
  document.getElementById('output').value = output; // Обновление поля "Сгенерированное обращение"
}

// Добавляем события на изменения для тега 1, тега 2 и поля комментария
document.getElementById('checkbox_text').addEventListener('change', updateGeneratedComment);
document.getElementById('tagSelect').addEventListener('change', updateGeneratedComment);
document.getElementById('tag_text').addEventListener('input', updateGeneratedComment);


//обработчик конопки копирования
document.getElementById("tag_copy").addEventListener("click", function() {
    const tag_main = document.getElementById("tagSelect").value;
    const main_text = document.getElementById("tag_text").value;
    const checkbox_fail = document.getElementById('checkbox_changes');
    const tag_phone = document.getElementById("tag_phone").value;
    const tag_data_time = document.getElementById("tag_data_time").value;

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
        tag_comment = "#ХолостойНа2ЛТП " + tag_comment;
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
