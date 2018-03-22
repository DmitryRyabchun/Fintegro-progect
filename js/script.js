//------------ФУНКЦИИ----------------------------------------------------------------------------------//

//Валидация форм логина
function LoginValidation() {
    $('.login-btn input').click(function () {
        if ($('#login_field').val().length == 0 || $('#password_field').val().length == 0) {
            $('#fill-error').html('Заполните все поля');
        } else {
            login();
        }
    });
}

//Отлов включеного CapsLock (функцию можно обмануть) 
function IsCapsLock() {
    $('html').keydown(function (e) {
        if (e.keyCode == 20) {
            $('#is-capslock').toggle();
        }
    });
}

//Перемещение из страницы "from" на страницу "to" по нажатию ссылки
function TransitionPage(from, to) {
    $('[href = ' + to + ']').click(function () {
        $('.' + to).show();
        $('.' + from).hide();
        saveCurrentPage(to);
        return false;
    });
}

//Перемення для проверки валидации формы регистрации
var VarRegItem = true;

//Валидация форм регистрации
function VarificationReg() {
    $('.reg__btn a').click(function () {
        VarificationLogin();
        VarificationPass();
        VarificationValidPass();
        VarificationEmail('#reg__email', '.reg__err_email');
        VarificationCaptcha();

        if (VarRegItem) {
            registration();
        }
    });

}

//Проверка логина (Не менее 6 символов)
function VarificationLogin() {
    if ($('#reg__login').val().length < 6) {
        VarRegItem *= false;
        return $('.reg__err_login').html('Не менее 6 символов');
    }
    VarRegItem *= true;
    return $('.reg__err_login').html('');
}

//Проверка пароля (Не менее 6 символов)
function VarificationPass() {
    if ($('#reg__pass').val().length < 6) {
        VarRegItem *= false;
        return $('.reg__err_pass').html('Не менее 6 символов');
    }
    VarRegItem *= true;
    return $('.reg__err_pass').html('');
}

//Проверка подтверждения пароля (введите пароль еще раз)
function VarificationValidPass() {
    if ($('#reg__valid_pass').val().length != $('#reg__pass').val().length) {
        VarRegItem *= false;
        return $('.reg__err_valid_pass').html('Не совпадает');
    }
    VarRegItem *= true;
    return $('.reg__err_valid_pass').html('');
}

//Проверка E-mail на соответствие правильному формату
function VarificationEmail(field, err) {
    var pattern = /^[a-z0-9_-]+@[a-z0-9-]+\.([a-z]{1,6}\.)?[a-z]{2,6}$/i;
    if ($(field).val().search(pattern) != 0) {
        VarRegItem *= false;
        return $(err).html('Нe верный формат');
    }
    VarRegItem *= true;
    return $(err).html('');
}

//Проверка правильности CAPTCHA
function VarificationCaptcha() {
    if ($('#reg__captcha').val() != captcha_a + captcha_b) {
        CaptchaGeneration();
        VarRegItem *= false;
        return $('.reg__err_captcha').html('Не верно');
    }
    VarRegItem *= true;
    return $('.reg__err_captcha').html('');
}

//Генерация раномного чиста в диапазоне от min до max
function RandomInteger(min, max) {
    return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

//Переменные хранящие слагаемые для CAPTCHA
var captcha_a = RandomInteger(0, 100),
    captcha_b = RandomInteger(0, 100)

//Генерация CAPTCHA
function CaptchaGeneration() {
    $('#reg__captcha').attr('placeholder', captcha_a + ' + ' + captcha_b);
}

//Проверка E-mail для сброса пароля
function VarificationRecovery() {
    $('.recovery__btn').click(function () {
        VarificationEmail('#recovery__email', '.recovery__err_email');
    });
}

//Добавляет копирайт в футер
function AddCopyright() {
    var date = new Date();
    $('.footer__copyright p').html('© ' + date.getFullYear() + ' Copyright Text');
}

//Запоминает на какой странице сейчас находится пользователь
function saveCurrentPage(page) {
    sessionStorage.setItem('CurrentPage', page);
}

//При обновлении страницы выводит страницу на которой находился пользователь
//Если пользователь заходит на страницу, перебрасывает его к форме логина
function initPage() {
    if (!sessionStorage.getItem('CurrentPage')) saveCurrentPage('login');

    if (sessionStorage.sessionToken) {
        switch (sessionStorage.getItem('CurrentPage')) {
            case 'profile':
                showProfile();
                $('#main-page').show();
                break;
            case 'edit-profile':
                //showEditProfile();
                $('#main-page').show();
                $('.edit-profile').show();
                $('.profile').hide();
                break;
            case 'albums':
                //showAlbums();
        }
    } else {
        switch (sessionStorage.getItem('CurrentPage')) {
            case 'login':
                showLogin();
                $('.login').show();
                break;
            case 'reg':
                $('.reg').show();
                break;
            case 'recovery':
                $('.recovery').show();
                break;
        }
    }
}

//Вызод из профайла
function logout() {
    if (sessionStorage.sessionToken) {
        delete sessionStorage.sessionToken;
        window
            .location
            .reload();
        saveCurrentPage('login');
    }
}

//????????(Может быть нужно убрать)
function showLogin() {
    $('.login [name=loginButton]').attr('disabled', false);
    $('.login').show();
    saveCurrentPage('login');
}

//Вывод списка друзей
function showFriends(data) {
    var max = data.friends_count > 5 ? 5 : data.friends_count;
    var photo = '';
    $('.friends-block .card-content').html('');
    for (var i = 0; i < max; i++) {
        photo = data.friends[i].photo == null || data.friends[i].photo == '' ? 'img/no-image-user.jpg' : data.friends[i].photo;
        $('.friends-block .card-content').append(
            '<div class="friends-block__friends-item">' +
            '<div class="row">' +
            '<img src="' + photo + '" alt="">' +
            '<p class="col s6 offset-s1">' +
            '<b>' + data.friends[i].firstname + ' ' + data.friends[i].lastname + '</b>' +
            '<div class="row">' +
            '<input type="button" value="unfollow" class="btn col s4 unfollow" data-count="' + data.friends[i].user_id + '">' +
            '<input type="button" value="block" class="btn col s3 friends-block__block" data-count="' + data.friends[i].user_id + '">' +
            '</div>' +
            '</p>' +
            '</div>' +
            '</div>'
        );
    }
}

//Удаляет другого пользователя из списка друзей или врагов
function delFollower(elem) {
    var url = $(elem).attr("data-count");
    url = url + "";
    $.ajax({
        url: 'http://restapi.fintegro.com/social-activities/' + url,
        method: 'DELETE',
        dataType: 'json',
        headers: {
            bearer: sessionStorage.sessionToken
        },
        error: function(xhr, status, error) {
            console.log('ERROR!!!', xhr, status, error);
        },
        complete: function() {
            showProfile();
        }
    });
}

//Добавляет пользователя в список врагов
function addEnemy(elem) {
    $.ajax({
        url: 'http://restapi.fintegro.com/social-activities',
        method: 'POST',
        dataType: 'json',
        data: {
            user_id: $(elem).attr("data-count"),
            type: 2
        },
        headers: {
            bearer: sessionStorage.sessionToken
        },
        error: function(xhr, status, error) {
            console.log('ERROR!!!', xhr, status, error);
        },
        complete: function() {
            showProfile();
        }
    });
}

//------------ЗАПРОСЫ--------------------------------------------------------------------------------------------//

//Запрос на вход в систему
function login() {
    $.ajax({
        url: 'http://restapi.fintegro.com/login',
        method: 'POST',
        dataType: 'json',
        data: {
            username: $('#login_field').val(),
            password: $('#password_field').val()
        },
        beforeSend: function () {
            $('.login-btn input').attr('disabled', true);
        },
        success: function (data) {
            sessionStorage.sessionToken = data.token;

            window
                .location
                .reload();
        },
        error: function (xhr, status, error) {
            $('.login-btn input').attr('disabled', false);
            $("#fill-error").html("Неверный логин или пароль");
            console.log('ERROR!!!', xhr, status, error);
        },
        complete: function () {
            $('.login').hide();
            saveCurrentPage('profile');
            $('#main-page').show();
        }
    });
}

//Запрос на регистрацию нового пользователя
function registration() {
    $.ajax({
        url: 'http://restapi.fintegro.com/registration',
        method: 'POST',
        dataType: 'json',
        data: {
            login: $('#reg__login').val(),
            email: $('#reg__email').val(),
            password: $('#reg__pass').val(),
            firstname: $('#reg__name').val(),
            lastname: $('#reg__surname').val()
        },
        success: function (data) {
            $('.login').show();
            $('.reg').hide();
        },
        error: function (xhr, status, error) {
            console.log('ERROR!!!', xhr, status, error);
        }
    });
}

//Запрос пролучает данные и выводит их на основной странице (!!!!!!!!!!!!Над ним нужно поработать)
function showProfile() {

    $('.user__back-img').attr('background', 'img/i.jpg');
    $('.profile-img').attr('src', 'img/default_avatar.png');

    $.ajax({
        url: 'http://restapi.fintegro.com/profiles',
        method: 'GET',
        dataType: 'json',
        headers: {
            bearer: sessionStorage.sessionToken
        },
        success: function (data) {
            console.log(data);
            sessionStorage.setItem('UserId', data.profile.user_id);
            $('.user__profile-img').attr('src', data.profile.photo);
            $('.user__profile-name').html(data.profile.firstname + " " + data.profile.lastname);
            $('.user__progile-quote').html(data.profile.quote);
            $('.user__friend_count').html(data.friends_count);
            $('.user__enemies_count').html(data.enemies_count);

            var went = data.profile.went == '' ? 'no set' : data.profile.went;
            $('.user-about__content__went-to a').html(went);
            var lived = data.profile.lived == '' ? 'no set' : data.profile.lived;
            $('.user-about__content__lives-in a').html(lived);
            var from = data.profile.from == '' ? 'no set' : data.profile.from;
            $('.user-about__content__from a').html(from);

            //вывод списка друзей
            showFriends(data);


            $('.profile-firstname').html(data.profile.firstname);
            $('.profile-lastname').html(data.profile.lastname);


            // isDataProfile('.profile .about .went-to a', data.profile.went);
            // isDataProfile('.profile .about .lives-in a', data.profile.lived);
            // isDataProfile('.profile .about .from a', data.profile.from);

            //showFollowerList(sessionStorage.getItem('UserId'));

            $(".profile .show-search-result").hide();
            $('.profile .posts').show();
            $('.profile').show();
        },
        error: function (xhr, status, error) {
            console.log('ERROR!!!', xhr, status, error);
        }
    });

    //фотографии     
    setAlbums();
    // showPosts();
}

//Запрос на добавление альбомов в 
function setAlbums(user_id) {
    $.ajax({
        url: 'http://restapi.fintegro.com/albums',
        method: 'GET',
        dataType: 'json',
        data: user_id,
        headers: {
            bearer: sessionStorage.sessionToken
        },
        success: function(data) {
            console.log(data);
            $('.user__albums .card-content').html('');
            var max = data.albums.length > 2 ? 2 : data.albums.length;
            var photo = '';
            for(var i = 0; i < max; i++) {
                photo = data.albums[i].photos.length == 0 ? 'img/no-photo.png' : data.albums[i].photos[0].url;
                $('.user__albums .card-content').append('<div class="user__albums_album-block"><img src="' + photo + '" class="col s6" alt=""></div>')
            }
            
        },
        error: function(xhr, status, error) {
            console.log('ERROR!!!', xhr, status, error);
        }
    });
}


//Запрос на поиск пользователей!!!!!!!!!!!!!!!!!!
function searchUsers(search) {
    $.ajax({
        url: 'http://restapi.fintegro.com/search',
        method: 'GET',
        dataType: 'json',
        data: {
            search: search,
            limit: 10,
            page: 1
        },
        headers: {
            bearer: sessionStorage.sessionToken
        },
        success: function(data) {
            console.log(data);

        $('.wall__empty-item p').html('');
        $('.wall__empty-item>.row').html('');
        if(data.profiles.length == 0)  $('.wall__empty-item p').html('Совпадений не найдено');
        for(var i = 0; i < data.profiles.length; i++) {
            var photo = data.profiles[i].photo == null || data.profiles[i].photo == '' ? 'img/no-image-user.jpg' : data.profiles[i].photo;
            var quote = data.profiles[i].quote == null ? '' : data.profiles[i].quote; 
            $('.wall__empty-item>.row').append(
                '<div class="col s6">'+
                   ' <div class="search-friends__item">'+
                        '<div class="teal lighten-5 card">'+
                            '<img class="user__back-img" src="img/search_back_item.jpg">'+
                            '<div class="user__contain-profile-img">'+
                                '<img class="user__profile-img" src="' + photo + '">'+
                            '</div>'+
                            '<p>'+
                                '<b class="user__profile-name">' + data.profiles[i].firstname + ' ' + data.profiles[i].lastname + '</b>'+
                            '</p>'+
                            '<p class="user__progile-quote center">' + quote + '</p>'+
                            '<div class="row">'+
                                '<input type="button" class="btn" value="follow" data-count="' + data.profiles[i].user_id + '"></input>'+
                                '<input type="button" class="btn unfollow" value="unfollow" data-count="' + data.profiles[i].user_id + '"></input>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                '</div>'
            );
        }
        

            
        },
        error: function(xhr, status, error) {
            console.log('ERROR!!!', xhr, status, error);
        }
    });
}

//-------------ВЫПОЛНЯЕМАЯ  ЧАСТЬ----------------------------------------------------------------------------//

$(document).ready(function () {
    Materialize.updateTextFields();
    initPage();

    $('#is-capslock').hide();
    IsCapsLock();
    LoginValidation();



    //-------------СЦЕНАРИИ ПРИВЯЗАНЫЕ К КНОПКАМ-----------------------------------------------------------------//

    $('.login [href=reg]').click(function (e) {
        e.preventDefault();
        $('.login').hide();
        $('.reg').show();
        saveCurrentPage('reg');
    });

    $('.login [href=recovery]').click(function (e) {
        e.preventDefault();
        $('.login').hide();
        $('.recovery').show();
        saveCurrentPage('recovery');
    });

    $('.reg [href=login]').click(function (e) {
        e.preventDefault();
        $('.reg').hide();
        $('.login').show();
        saveCurrentPage('login');
    });

    $('.recovery [href=login]').click(function (e) {
        e.preventDefault();
        $('.recovery').hide();
        $('.login').show();
        saveCurrentPage('login');
    });


    $('[name=logout]').click(function () {
        logout();
    });

    $('[href=profile]').click(function() {
        $('.profile').show();
        $('.edit-profile').hide();
        saveCurrentPage('profile');
        showProfile();
        return false;
    });

    $('.friends-block .card-content').on('click', '.unfollow', function() {
        delFollower(this);
    });

    $('.friends-block .card-content').on('click', '.friends-block__block', function() {
        addEnemy(this);
    });

    $('.nav__search-btn').click(function() {
        searchUsers($('#nav__search-field').val());
    });

    AddCopyright();

    TransitionPage('reg', 'login');
    TransitionPage('login', 'reg');
    TransitionPage('login', 'recovery');
    TransitionPage('recovery', 'login');

    TransitionPage('profile','edit-profile');


    VarificationReg();
    CaptchaGeneration();

    VarificationRecovery();


});










//   border-bottom: 2px solid lightgray;
//   border-left: 2px solid lightgray;
//   background: #f3f3f3;