# Страшная правда о `gap` в CSS

<style>
.parent {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5em;
	border: 1px solid #ddd;
	padding: 0.5em;
	resize: horizontal; 
	overflow: auto;
	max-width: 100%;
	min-width: 100px;
}
.child {
	background-color: #eee;
	height: 2em;
}
</style>

Самый базовый юзкейс для флексбокса: расположить в блоке энное количество элементов по какому-то шаблону. Преимущество именно флексбокса в том, что размеры элементов будут автоматически подстраиваться под размер родительского блока (примеру ниже можно менять размер). 

Один из самых базовых шаблонов: элементы все одинакового размера и стоят по строчкам.

<style>
.child.correct {
	flex-basis: calc(25% - 0.5em * 0.75);
}
</style>
<div class="parent correct">
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
	<div class="child correct"></div>
</div>

Для того, чтобы задать отступы между элементами, используется css-свойство `gap`. Но он имеет одну страшную особенность, об которую обязательно спотыкается всякий, кто пытается использовать `gap` в первый раз.

Вот, казалось бы, логичный код:

```css
.parent {
  display: flex; /* отображать по флексу */
  flex-wrap: wrap; /* переносить строки */
  gap: 0.5em; /* интервал между элементами */
}
.child {
  flex-basis: 25%; /* каждый элемент занимает 25% (¼) строки */
  height: 2em;
}
```

Однако он выдаст вот такой результат:

<style>
.child.wrong {
	flex-basis: 25%;
}
</style>
<div class="parent">
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
	<div class="child wrong"></div>
</div>

В строке поместилось всего три элемента, а четвёртый уехал на следующую. Почему так вышло? А вот и настало время раскрыть грязный секрет... 

Оно всё работает так, что сначала элементу задаётся размер `25%`, а потом к этому размеру прибавляется отступ. Соответственно, при отрисовке получается, что элемент занимает не `25%`, а `25% + 0.5em * 0.75`, где `0.75` это три отступа, которые должны быть между четырьмя элементами. Поскольку второе больше, чем первое, последний элемент переносится на следующую строку, так как в свою он не влезает.

Чтобы компенсировать эти `0.5em * 0.75`, надо написать следующий довольно уродливый код:

```css
.parent {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
}
.child {
  flex-basis: calc(25% - 0.5em * 0.75); /* изменение тут */
  height: 2em;
}
```

Если есть задача сделать так, чтобы на разных размерах экрана было разное количество элементов в строке, нужно использовать такую формулу:

```
flex-basis = (100% / perRow) - gap * (1 - 1 / perRow)
```

А на самом деле, конечно, промежутки между элементами не должны учитываться в их размере. Я не знаю, зачем такое поведение сделано, но каждый раз писать эту формулу-мантру — бред.