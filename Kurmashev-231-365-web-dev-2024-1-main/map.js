ymaps.ready(init)
  
function init() {
    var myMap = new ymaps.Map('map', {   //Создание карты 
        center: [55.753994, 37.622093],
        zoom: 9,
        // Добавим панель маршрутизации.
        controls: ['routePanelControl'] 
    });

    var control = myMap.controls.get('routePanelControl'); //откуда и куда

    control.options.set({  
        maxWidth: '250',
    });

    var multiRoutePromise = control.routePanel.getRouteAsync(); //стили 17-30
    multiRoutePromise.then(function(multiRoute) {
      multiRoute.options.set({
        // Цвет метки начальной точки.
        wayPointStartIconContentLayout: ymaps.templateLayoutFactory.createClass(
            '<span>Вы здесь</span>'),
        // Цвет метки конечной точки.
        wayPointFinishIconContentLayout: ymaps.templateLayoutFactory.createClass(
            '<span>Место назначения</span>'), 
        // Внешний вид линий (для всех маршрутов).
      });  
    }, function (err) {
      console.log(err); 
    });
    // Зададим состояние панели для построения машрутов.
    control.routePanel.state.set({
        // Тип маршрутизации.
        type: 'pedestrian', //пешеход
        // Включим возможность задавать пункт отправления в поле ввода.
        fromEnabled: true, //двигать первоначальную точку
        // Включим возможность задавать пункт назначения в поле ввода.
        toEnabled: true, //двигать конеч точку
        // Адрес или координаты пункта назначения.
    });
    // Объявляем обработчик для кнопки.
    switchPointsButton.events.add('click', function () {
        // Меняет местами начальную и конечную точки маршрута.
        control.routePanel.switchPoints(); 
    });
    myMap.controls.add(switchPointsButton);
}