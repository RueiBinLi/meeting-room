/*!
* Start Bootstrap - Agency v7.0.12 (https://startbootstrap.com/theme/agency)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-agency/blob/master/LICENSE)
*/

// const { start } = require("repl");

//
// Scripts
// 
//<link href="css/styles.css" rel="stylesheet" />

window.addEventListener('DOMContentLoaded', event => {
    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    //  Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    const socket = new WebSocket('ws://localhost:3000');

    socket.onopen = function() {
        console.log('WebSocket connection established');
    };

    socket.onmessage = function(event) {
        if (event.data === 'update') {
            window.location.reload();
        }
    };

    socket.onclose = function() {
        console.log('WebSocket connection closed');
    };

    socket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

});

// document.addEventListener('DOMContentLoaded', function() {
//     if (window.location.pathname.endsWith('index.html')) {
//         console.log('DOM loaded');
        
//     }
// });

$(document).ready(function() {
    if (document.body.classList.contains('index')) {
        checkLoginStatus();
        needLogin();
        document.getElementById('checkInBtn').hidden = false;
        loginEvent();
        setInterval(loadReservation, 1000);
        checkInBlock();
        verificationSend();
        emailBlock();
        signUpBlock();
        resetPasswordBlcok();
        dateDisable();
        roomContainer();
        equipContainer();
        moreRoomContainer();
        moreEquipContainer();
        // setInterval(roomContainer,1000);
        // setInterval(equipContainer,1000);
        // setInterval(moreRoomContainer,1000);
        // setInterval(moreEquipContainer,1000);
        // reservate_room();
        applyRoleSettings();
    }

    if (document.body.classList.contains('reservationTable')) {
        displayRoomTable();
        displayEquipTable();
    }

    if (document.body.classList.contains('reservationPage')) {
        startTimeAndEndTime();
        equipStartTimeAndEndTime();
        sliderBlock();
        dateDisable();
        reservationRoomContainer();
        reservationEquipContainer();
        // setInterval(reservationRoomContainer,1000);
        // setInterval(reservationEquipContainer,1000);
    }

    if(document.body.classList.contains('manage_interface')) {
        changePage();
        displayUserTable();
        addUser();
        displayRoomReservationTable();
        displayEquipReservationTable();
    }
});

function needLogin() {
    document.querySelectorAll('.needLogin').forEach(function(link) {
        link.addEventListener('click', function(event) {
            const loggedIn = localStorage.getItem('loggedIn');
            if (!loggedIn) {
                event.preventDefault(); // 阻止鏈接的默認行為
                alert("請先登入");
            }
        });
    });
}

function checkLoginStatus() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn === 'true') {
        document.getElementById('loggedInSection').hidden = false;
        document.getElementById('loggedOutSection').hidden = true;
        document.getElementById('navbar-login').hidden = true;
        document.getElementById('navbar-logout').hidden = false;
    } else {
        document.getElementById('loggedInSection').hidden = true;
        document.getElementById('loggedOutSection').hidden = false;
        document.getElementById('navbar-login').hidden = false;
        document.getElementById('navbar-logout').hidden = true;
    }
}

function login(event) {
    event.preventDefault();
    localStorage.setItem('loggedIn', true);

    var loginModal = document.getElementById('login_page');
    var modalInstance = bootstrap.Modal.getInstance(loginModal);
    modalInstance.hide();

    checkLoginStatus();
}

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userPermission');
    checkLoginStatus();
    applyRoleSettings();
}

function displayTable() {

}

var permission = '';

function loginEvent() {
    $('#logInButton').on('click', function(event) {
        event.preventDefault(); // Prevent the default form submission

        $('#alertContainer-enterEmail').html('');
        $('#alertContainer-enterPassword').html('');
        $('#alertContainer-wrongLogIn').html('');

        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'css/styles.css'
        }).appendTo('head');

        const email = $('#logInEmail').val();
        const password = $('#logInPassword').val();
        if(!email && !password) {
            $('#alertContainer-enterEmail').html('<div class="alert alert-danger">請輸入電子信箱<br>請輸入密碼</div>');
            return;
        } else if (!email) {
            $('#alertContainer-enterEmail').html('<div class="alert alert-danger">請輸入電子信箱</div>');
            return;
        } else if (!password) {
            $('#alertContainer-enterPassword').html('<div class="alert alert-danger">請輸入密碼</div>');
            return;
        }

        $.ajax({
            url: "http://localhost:3000/user",
            dataType: 'json',
            success: function(data) {
                var emailExists = false;
                var passwordExists = false;
                data.forEach(user => {
                    if (user.email === email && user.password === password) {
                        emailExists = true;
                        passwordExists = true;
                        permission = user.permission;
                    }
                });

                if (emailExists && passwordExists) {
                    login(event);
                } else {
                    $('#alertContainer-wrongLogIn').html('<div class="alert alert-danger">錯誤的電子信箱或密碼</div>');
                }


                checkUserPermission();
                applyRoleSettings();
            },
                error: function(error) {
                console.error('Error loading JSON data', error);
                $('#modalBody').text('加載數據時出錯，請稍後再試');
                $('#resetPasswordPage').modal('show');
            }
        });
    });
}

function checkUserPermission() {
    if (permission === 'admin') {
        localStorage.setItem('userPermission', true);
    } else {
        localStorage.setItem('userPermission', false);
    }
}

function applyRoleSettings() {
    const permission = localStorage.getItem('userPermission');
    console.log('User permission:', permission);
    if (permission === 'true') {
        document.getElementById('userMenu').hidden = false;
    } else {
        document.getElementById('userMenu').hidden = true;
    }
}

let reservationInfo = {};

// 顯示下一個預約和打卡按鈕
function loadReservation()  {
    $.ajax({
        url: "http://localhost:3000/room-reservation",
        dataType: 'json',
        success: function(data) {
            data.sort((a, b) => {
                const dateA = new Date(a.date + ' ' + a.startTime);
                const dateB = new Date(b.date + ' ' + b.startTime);
                return dateA - dateB;
            });

            const now = new Date();

            // data.forEach(reservation => {
            //     const start = new Date(reservation.date + ' ' + reservation.startTime);
            //     const end = new Date(reservation.date + ' ' + reservation.endTime);
            //     if(now >= start && now <= end) {
                    
            //     }
            // });

            let nextReservationBody = '';
            nextReservationBody += `<p class="text-black">下一個預約:</p>`;
            if (data.length > 0) {
                for (const reservation of data) {
                    const start = new Date(reservation.date + ' ' + reservation.startTime);
                    const end = new Date(reservation.date + ' ' + reservation.endTime);
                    // console.log('Next reservation:', reservation);
                    if(now < end && reservation.status === '尚未結束') {
                        nextReservationBody += `
                            <p class="text-black text fs-5">會議室: ${reservation.name}</p>
                            <p class="text-black text fs-5">日期: ${reservation.date}</p>
                            <p class="text-black text fs-5">開始時間: ${reservation.startTime} 結束時間: ${reservation.endTime}</p>
                        `;
                        reservationInfo = {
                            name: reservation.name,
                            date: reservation.date,
                            startTime: reservation.startTime,
                            endTime: reservation.endTime
                        };
                        break;
                    }
                }
            }

            if (nextReservationBody === '<p class="text-black">下一個預約:</p>') {
                nextReservationBody += '<p class="text-black text fs-5">沒有預約</p>';
                document.getElementById('checkInBtn').hidden = true;
                document.getElementById('checkOutBtn').hidden = true;
                document.getElementById('notOpenBtn').hidden = false;
            }

            $('#next-reservation').html(nextReservationBody);

            // const nextReservation = data.find(reservation => {
            //     const start = new Date(reservation.date + ' ' + reservation.startTime);
            //     const end = new Date(reservation.date + ' ' + reservation.endTime);
            //     return now >= start && now <= end;
            // });

            // if (nextReservation) {
            //     document.getElementById('checkInBtn').hidden = false;
            //     document.getElementById('notOpenBtn').hidden = true;
            // } else {
            //     document.getElementById('checkInBtn').hidden = true;
            //     document.getElementById('notOpenBtn').hidden = false;
            // }
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
}

function checkInBlock() {
    document.getElementById('checkInBtn').hidden = false;
    $('#checkInBtn').on('click', function(event) {
        document.getElementById('checkInBtn').hidden = true;
        document.getElementById('checkOutBtn').hidden = false;
    });

    $('#checkOutBtn').on('click', function(event) {
        document.getElementById('checkOutBtn').hidden = true;
        document.getElementById('notOpenBtn').hidden = false;

        const reservationName = reservationInfo.name;
        const reservationDate = reservationInfo.date;
        const reservationStartTime = reservationInfo.startTime;
        const reservationEndTime = reservationInfo.endTime;

        $.ajax({
            url: "http://localhost:3000/update-room-reservation-status",
            type: 'POST', 
            contentType: 'application/json',
            data: JSON.stringify({ name: reservationName, date: reservationDate, startTime: reservationStartTime, endTime: reservationEndTime, status: '已結束' }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });
    })
}

// 讀取json檔案的會議室預約紀錄
function displayRoomTable() {
    const rowsPerPage = 5;
    let currentPage = 1;
    let reservations = [];
    
    function roomTable() {    
        $.ajax({
            url: "http://localhost:3000/room-reservation",
            dataType: 'json',
            success: function(data) {
                data.sort((a, b) => {
                    const dateA = new Date(a.date + ' ' + a.startTime);
                    const dateB = new Date(b.date + ' ' + b.startTime);
                    return dateA - dateB;
                });
                reservations = data;
                renderTable_room();
                renderPagination_room();
            },
            error: function(error) {
                console.error('Error loading JSON data', error);
            }
        });
    }

    function renderTable_room() {
        let tableBody = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = reservations.slice(start, end);
        
        pageData.forEach((reservation,id) => {
            tableBody += `
                <tr>
                    <td>${start + id + 1}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.startTime}</td>
                    <td>${reservation.endTime}</td>
                    <td>${reservation.name}</td>
                    <td>${reservation.status}</td>
                    <td><button class="btn btn-secondary btn-l" 
                                onclick="deleteRowRoom(this)"
                                data-user="${reservation.user}"
                                data-date="${reservation.date}"
                                data-startTime="${reservation.startTime}"
                                data-endTime="${reservation.endTime}"
                                data-name="${reservation.name}"
                                data-address="${reservation.address}"
                                data-status="${reservation.status}">
                            取消
                        </button>
                    </td>
                </tr>
            `;
        });
        $('#myReservationTable-room').html(tableBody);
    }

    function renderPagination_room() {
        const pagination = $('#pagination');
        pagination.empty();

        const totalPages = Math.ceil(reservations.length / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            pagination.append(`
                <button class="pageBtn btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" onclick="changePage(${i})">${i}</button>
            `);
        }
    }

    window.changePage = function(page) {
        currentPage = page;
        renderTable_room();
        renderPagination_room();
    }

    window.deleteRowRoom = function(button) {
        const row = button.closest('tr');
        const roomReservationUser = button.getAttribute('data-user');
        const roomReservationDate = button.getAttribute('data-date');
        const roomReservationStartTime = button.getAttribute('data-startTime');
        const roomReservationEndTime = button.getAttribute('data-endTime');
        const roomReservationName = button.getAttribute('data-name');
        const roomReservationAddress = button.getAttribute('data-address');
        const roomReservationStatus = button.getAttribute('data-status');

        $.ajax({
            url: "http://localhost:3000/delete-room-reservation",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                user: roomReservationUser,
                date: roomReservationDate,
                startTime: roomReservationStartTime,
                endTime: roomReservationEndTime,
                name: roomReservationName,
                address: roomReservationAddress,
                status: roomReservationStatus
             }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
                row.remove();
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });


        renderTable_room();
        renderPagination_room();
    }

    roomTable();
}

// 讀取json檔案的設備預約紀錄
function displayEquipTable() {
    const rowsPerPage = 5;
    let currentPage = 1;
    let reservations = [];

    function equipTable() {
        $.ajax({
            url: "http://localhost:3000/equip-reservation",
            dataType: 'json',
            success: function(data) {
                data.sort((a, b) => {
                    const dateA = new Date(a.date + ' ' + a.startTime);
                    const dateB = new Date(b.date + ' ' + b.startTime);
                    return dateA - dateB;
                });

                reservations = data;
                renderTable_equip();
                renderPagination_equip();              
            },
            error: function(error) {
                console.error('Error loading JSON data', error);
            }
        });
    }

    function renderTable_equip() {
        let tableBody = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = reservations.slice(start, end);
        
        pageData.forEach((reservation, id) => {
            tableBody += `
                <tr>
                    <td>${start + id + 1}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.startTime}</td>
                    <td>${reservation.endTime}</td>
                    <td>${reservation.equipment}</td>
                    <td>${reservation.status}</td>
                    <td><button class="btn btn-secondary btn-l" 
                                onclick="deleteRowEquip(this)"
                                data-date="${reservation.date}"
                                data-startTime="${reservation.startTime}"
                                data-endTime="${reservation.endTime}"
                                data-name="${reservation.name}"
                                data-status="${reservation.status}">
                            取消
                        </button>
                    </td>
                </tr>
            `;
        });
        $('#myReservationTable-equip').html(tableBody);
    }

    function renderPagination_equip() {
        const pagination = $('#pagination-equip');
        pagination.empty();

        const totalPages = Math.ceil(reservations.length / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            pagination.append(`
                <button class="pageBtn btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" onclick="changePage_equip(${i})">${i}</button>
            `);
        }
    }

    window.changePage_equip = function(page) {
        currentPage = page;
        renderTable_equip();
        renderPagination_equip();
    }

    window.deleteRowEquip = function(button) {
        const row = button.closest('tr');

        const reservationDate = button.getAttribute('data-date');
        const reservationStartTime = button.getAttribute('data-startTime');
        const reservationEndTime = button.getAttribute('data-endTime');
        const reservationName = button.getAttribute('data-name');
        const reservationStatus = button.getAttribute('data-status');

        // console.log('Deleting reservation:', {
        //     date: reservationDate,
        //     startTime: reservationStartTime,
        //     endTime: reservationEndTime,
        //     name: reservationName,
        //     status: reservationStatus
        // });

        $.ajax({
            url: 'http://localhost:3000/delete-equip-reservation',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                date: reservationDate,
                startTime: reservationStartTime,
                endTime: reservationEndTime,
                name: reservationName,
                status: reservationStatus
            }),
            success: function(response) {
                console.log('Reservation deleted successfully', response);
                // 删除行元素
                row.remove();
            },
            error: function(error) {
                console.error('Error deleting reservation', error);
            }
        });
    
        renderTable_equip();
        renderPagination_equip();
    }

    equipTable();
}

// 判斷email是否存在
function emailBlock() {
    $('#sendEmailButton').on('click', function(event) {
        event.preventDefault(); // Prevent the default form submission

        $('#alertContainer-sendSuccess').html('');
        $('#alertContainer-wrongEmail').html('');

        $('<link/>', {
            rel: 'stylesheet',
            type: 'text/css',
            href: 'css/styles.css'
        }).appendTo('head');

        const email = $('#emailInput').val();
        if (!email) {
            alert('請輸入電子郵件');
            return;
        }

        $.ajax({
            url: "http://localhost:3000/user",
            dataType: 'json',
            success: function(data) {
                var emailExists = false;
                data.forEach(user => {
                    if (user.email === email) {
                        emailExists = true;
                    }
                });

                if (emailExists) {
                    // $('#resetPasswordPage').modal('show');
                    // $('#forgetPassword').modal('hide');
                    $('#alertContainer-sendSuccess').html('<div class="alert alert-success">驗證碼已發送到您的郵箱</div>');
                    sendEmail();
                    // 在这里发送实际的电子邮件请求（后端处理）
                    // 例如，您可以使用另一个 AJAX 调用发送电子邮件请求到您的后端
                } else {
                    $('#alertContainer-wrongEmail').html('<div class="alert alert-danger">沒有找到該郵箱地址，請重試</div>');
                }
            },
            error: function(error) {
                console.error('Error loading JSON data', error);
                $('#modalBody').text('加載數據時出錯，請稍後再試');
                $('#resetPasswordPage').modal('show');
            }
        });
    });
}

// 讓alert消失
function verificationSend() {
    $('#verification-code').on('focus', function() {
        $('#alertContainer-sendSuccess').html('<div class="alert alert-success">重設密碼的連結已發送到您的郵箱</div>');
    });
}

let storedVerificationCode = null;

function sendEmail() {
    const email = document.getElementById('emailInput').value;

    $.ajax({
        url: 'http://localhost:3000/send-email',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: email }),
        success: function(response) {
            $('#resetPasswordPage').modal('show');
            $('#forgetPassword').modal('hide');
            storedVerificationCode = response.code;
            // console.log('Verification code:', storedVerificationCode);
        },
        error: function(error) {
            $('#alertContainer-wrongEmail').html('');
            $('#alertContainer-wrongEmail').html('<div class="alert alert-danger">email發送錯誤</div>');
        }
    });
}

// 註冊
function signUpBlock() {
    $('#signUpForm').on('submit', function(event) {
        event.preventDefault();

        const email = $('#signUpEmail').val();
        const password = $('#signUpPassword').val();
        const repassword = $('#signUpRePassword').val();
        const signUpName = $('#signUpName').val();

        $('#alertContainer-signUp-diffPassword').html();

        if (password !== repassword) {
            $('#alertContainer-signUp-diffPassword').html('<div class="alert alert-danger">密碼不一致，請重新輸入</div>');
            return;
        }

        const userData = {
            email: email,
            password: password,
            name: signUpName,
            verificationCode: "",
            permission: "user"
        };

        $.ajax({
            url: 'http://localhost:3000/update-json',  // Replace with your server endpoint
            type: 'POST',
            data: JSON.stringify(userData),
            contentType: 'application/json',
            success: function(response) {
                alert('註冊成功');
                $('#signUpForm')[0].reset();
            },
            error: function(error) {
                alert('註冊失敗');
                console.error('Error:', error);
            }
        });
    });
}

// 重設密碼
function resetPasswordBlcok() {
    $('#resetPasswordForm').on('submit', function(event) {
        event.preventDefault();

        const code = $('#verification-code').val();
        const newPassword = $('#new-password').val();
        const newRePassword = $('#new-repassword').val();

        if (storedVerificationCode != code) {
            alert('驗證碼輸入錯誤');
            return
        }

        if (newPassword !== newRePassword) {
            alert('密碼不一致，請重新輸入');
            return;
        }

        $.ajax({
            url: 'http://localhost:3000/reset-password',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ code: code, newPassword: newPassword }),
            success: function(response) {
                alert('密碼重設成功');
                $('#resetPasswordForm')[0].reset();
            },
            error: function(error) {
                alert('密碼重設失敗，請重試');
                console.error('Error:', error);
            }
        });
    });
}

// 今天的日期以前不可選
function dateDisable() {
    var today = new Date().toISOString().split('T')[0];
    document.getElementById('select-date').setAttribute('min', today);
    document.getElementById('select-date-equipment').setAttribute('min', today);
}

function addOptions(hourStart, minuteStart, selectElement) {
    for (var hour = hourStart; hour < 24; hour++) {
        for (var minute = minuteStart; minute < 60; minute += 30) {
            var option = document.createElement("option");
            option.text = ('0' + hour).slice(-2) + ":" + ('0' + minute).slice(-2);
            option.value = ('0' + hour).slice(-2) + ":" + ('0' + minute).slice(-2);
            selectElement.add(option);
        }
        minuteStart = 0;
    }
}

// 會議室搜尋開始時間和結束時間的選項
function startTimeAndEndTime() {
    var now = new Date();
    var dateInput = document.getElementById('select-date');

    dateInput.addEventListener('change', function() {
        var selectedDate = new Date(dateInput.value);
        var selectStartTime = document.getElementById('startTime');
        var selectEndTime = document.getElementById('endTime');
        
        // Clear previous options
        selectStartTime.innerHTML = '';
        selectEndTime.innerHTML = '';
        
        if (selectedDate.toISOString().split('T')[0] === now.toISOString().split('T')[0]) {
            let getHours = now.getHours();
            let getMinutes = now.getMinutes() > 30 ? 0 : 30;

            if (now.getMinutes() > 30) {
                getHours += 1;
            }

            addOptions(getHours, getMinutes, selectStartTime);       
            addOptions(getHours, getMinutes, selectEndTime);
        } else {
            addOptions(0, 0, selectStartTime);
            addOptions(0, 0, selectEndTime);
        }
    });

    document.getElementById('startTime').addEventListener('change', function() {
        var selectEndTime = document.getElementById('endTime');
        selectEndTime.innerHTML = '';
        var startTimeValue = document.getElementById('startTime').value;
        var [startHour, startMinute] = startTimeValue.split(':').map(Number);
        var selectEndTime = document.getElementById('endTime');

        function addOptions(hourStart, minuteStart, selectElement) {
            for (var hour = hourStart; hour < 24; hour++) {
                for (var minute = minuteStart; minute < 60; minute += 30) {
                    var option = document.createElement("option");
                    option.text = ('0' + hour).slice(-2) + ":" + ('0' + minute).slice(-2);
                    option.value = ('0' + hour).slice(-2) + ":" + ('0' + minute).slice(-2);
                    selectElement.add(option);
                }
                minuteStart = 0; // reset minutes after the first loop
            }
        }

        // Add options for end time starting from the selected start time + 30 minutes
        if (startMinute === 30) {
            startHour += 1;
            startMinute = 0;
        } else {
            startMinute = 30;
        }
        addOptions(startHour, startMinute, selectEndTime);
    });

    var calendarInput = document.getElementById('calendarInput');
    var timeConfirmButton = document.getElementById('time-confirm');
    var selectStartTime = document.getElementById('startTime');
    var selectEndTime = document.getElementById('endTime');

    timeConfirmButton.addEventListener('click', function() {
        var selectedDate = new Date(dateInput.value);
        var formattedDate = selectedDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
        var startTime = selectStartTime.value;
        var endTime = selectEndTime.value;
        
        calendarInput.placeholder = formattedDate + ' ' + startTime + ' - ' + endTime;
    });
}

// 顯示slider
function sliderBlock() {
    var slider = document.getElementById('slider');
    noUiSlider.create(slider, {
        start: [1, 60],
        connect: true,
        range: {
            'min': 1,
            'max': 60
        }
    });

    var minValue = document.getElementById('minValue');
    var maxValue = document.getElementById('maxValue');

    slider.noUiSlider.on('update', function (values, handle) {
        var value = Math.round(values[handle]);
        if (handle === 0) {
            minValue.value = value;
        } else {
            maxValue.value = value;
        }
        var participantsInput = document.getElementById('participantsInput');
        participantsInput.placeholder = minValue.value + ' - ' + maxValue.value + ' 人';
    });

    minValue.addEventListener('change', function() {
        slider.noUiSlider.set([this.value, null]);
        var participantsInput = document.getElementById('participantsInput');
        participantsInput.placeholder = minValue.value + ' - ' + maxValue.value + ' 人';
    });


    maxValue.addEventListener('change', function() {
        slider.noUiSlider.set([null, this.value]);
        var participantsInput = document.getElementById('participantsInput');
        participantsInput.placeholder = minValue.value + ' - ' + maxValue.value + ' 人';
    });
}

// 設備搜尋開始時間和結束時間的選項
function equipStartTimeAndEndTime() {
    var now = new Date();
    var dateInput = document.getElementById('select-date-equipment');

    dateInput.addEventListener('change', function() {
        var selectedDate = new Date(dateInput.value);
        var selectStartTime = document.getElementById('startTime-equipment');
        var selectEndTime = document.getElementById('endTime-equipment');
        
        // Clear previous options
        selectStartTime.innerHTML = '';
        selectEndTime.innerHTML = '';
        
        if (selectedDate.toISOString().split('T')[0] === now.toISOString().split('T')[0]) {
            let getHours = now.getHours();
            let getMinutes = now.getMinutes() > 30 ? 0 : 30;

            if (now.getMinutes() > 30) {
                getHours += 1;
            }

            addOptions(getHours, getMinutes, selectStartTime);       
            addOptions(getHours, getMinutes, selectEndTime);
        } else {
            addOptions(0, 0, selectStartTime);
            addOptions(0, 0, selectEndTime);
        }
    });

    document.getElementById('startTime-equipment').addEventListener('change', function() {
        var selectEndTime = document.getElementById('endTime-equipment');
        selectEndTime.innerHTML = '';
        var startTimeValue = document.getElementById('startTime-equipment').value;
        var [startHour, startMinute] = startTimeValue.split(':').map(Number);
        var selectEndTime = document.getElementById('endTime-equipment');

        function addOptions(hourStart, minuteStart, selectElement) {
            for (var hour = hourStart; hour < 24; hour++) {
                for (var minute = minuteStart; minute < 60; minute += 30) {
                    var option = document.createElement("option");
                    option.text = ('0' + hour).slice(-2) + ":" + ('0' + minute).slice(-2);
                    option.value = ('0' + hour).slice(-2) + ":" + ('0' + minute).slice(-2);
                    selectElement.add(option);
                }
                minuteStart = 0; // reset minutes after the first loop
            }
        }

        // Add options for end time starting from the selected start time + 30 minutes
        if (startMinute === 30) {
            startHour += 1;
            startMinute = 0;
        } else {
            startMinute = 30;
        }
        addOptions(startHour, startMinute, selectEndTime);
    });

    var calendarInput = document.getElementById('equipTimeInput');
    var timeConfirmButton = document.getElementById('time-confirm-equipment');
    var selectStartTime = document.getElementById('startTime-equipment');
    var selectEndTime = document.getElementById('endTime-equipment');

    timeConfirmButton.addEventListener('click', function() {
        var selectedDate = new Date(dateInput.value);
        var formattedDate = selectedDate.toLocaleDateString('en-CA'); // Format as YYYY-MM-DD
        var startTime = selectStartTime.value;
        var endTime = selectEndTime.value;
        
        calendarInput.placeholder = formattedDate + ' ' + startTime + ' - ' + endTime;
    });
}

function addOptions(hourStart, minuteStart, selectElement) {
    for (var hour = hourStart; hour < 24; hour++) {
        for (var minute = minuteStart; minute < 60; minute += 30) {
            var option = document.createElement("option");
            option.text = ('0' + hour).slice(-2) + ":" + ('0' + minute).slice(-2);
            option.value = ('0' + hour).slice(-2) + ":" + ('0' + minute).slice(-2);
            selectElement.add(option);
        }
        minuteStart = 0;
    }
}

function initializeDateTimePicker(selectDate, startTime, endTime) {
    var now = new Date();
    var dateInputSearch = document.getElementById(selectDate);
    if (!dateInputSearch) return;

    // 預約會議室頁面的今天日期已前不可選
    var today = new Date().toISOString().split('T')[0];
    dateInputSearch.setAttribute('min', today);

    dateInputSearch.addEventListener('change', function() {
        var selectedDateSearch = new Date(dateInputSearch.value);
        var selectStartTimeSearch = document.getElementById(startTime);
        var selectEndTimeSearch = document.getElementById(endTime);

        selectStartTimeSearch.innerHTML = '';
        selectEndTimeSearch.innerHTML = '';

        if (selectedDateSearch.toISOString().split('T')[0] === now.toISOString().split('T')[0]) {
            let getHours = now.getHours();
            let getMinutes = now.getMinutes() > 30 ? 0 : 30;

            if (now.getMinutes() > 30) {
                getHours += 1;
            }
            
            addOptions(getHours, getMinutes > 30 ? 0 : 30, selectStartTimeSearch);
            addOptions(getHours, getMinutes, selectEndTimeSearch);
        } else {
            addOptions(0, 0, selectStartTimeSearch);
            addOptions(0, 0, selectEndTimeSearch);
        }
    });

    var startTimeSearch = document.getElementById(startTime);
    if (startTimeSearch) {
        startTimeSearch.addEventListener('change', function() {
            var selectEndTimeSearch = document.getElementById(endTime);
            selectEndTimeSearch.innerHTML = '';
            var startTimeValue = startTimeSearch.value;
            var [startHour, startMinute] = startTimeValue.split(':').map(Number);

            if (startMinute === 30) {
                startHour += 1;
                startMinute = 0;
            } else {
                startMinute = 30;
            }
            addOptions(startHour, startMinute, selectEndTimeSearch);
        });
    }
}

// 會議室預約頁面
function handleRoomClick(event) {
    event.preventDefault();
    const roomName = event.currentTarget.getAttribute('data-room-name');

    $.ajax({
        url: "http://localhost:3000/meeting-room",
        dataType: 'json',
        success: function(data) {
            let roomBody = '';
            let roomBodyForStatus = '';
            let moreRoomBodyForStatus = '';
            const room = data.find(room => room.name == roomName);
            if (room) {
                roomBody += `
                    <h2 class="text-uppercase">${room.name}</h2>
                    <p class="item-intro text-muted">地點: ${room.address}</p>
                    <img class="img-fluid d-block mx-auto" src="${room.img}" alt="..." />
                    <p class="item-intro fs-4">介紹: ${room.description}</p>
                    <div class="row align-items-center mb-4">
                        <div class="col-md-4 label-column">
                            <div class="text-center"><label for="select-date-search">日期:</label></div>
                            <input type="date" list="dates" class="form-control text-center" id="select-date-search">
                            <datalist id="dates"></datalist>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="startTimeSearch">開始時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="startTimeSearch"></select>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="endTimeSearch">結束時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="endTimeSearch"></select>
                        </div>
                    </div>
                `;
                roomBodyForStatus += `
                    <h2 class="text-uppercase">${room.name}</h2>
                    <p class="item-intro text-muted">地點: ${room.address}</p>
                    <img class="img-fluid d-block mx-auto" src="${room.img}" alt="..." />
                    <p class="item-intro fs-4">介紹: ${room.description}</p>
                    <div class="row align-items-center mb-4">
                        <div class="col-md-4 label-column">
                            <div class="text-center"><label for="select-date-search-forStatus">日期:</label></div>
                            <input type="date" list="dates" class="form-control text-center" id="select-date-search-forStatus">
                            <datalist id="dates"></datalist>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="startTimeSearch-forStatus">開始時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="startTimeSearch-forStatus"></select>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="endTimeSearch-forStatus">結束時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="endTimeSearch-forStatus"></select>
                        </div>
                    </div> 
                `;
                moreRoomBodyForStatus += `
                    <h2 class="text-uppercase">${room.name}</h2>
                    <p class="item-intro text-muted">地點: ${room.address}</p>
                    <img class="img-fluid d-block mx-auto" src="${room.img}" alt="..." />
                    <p class="item-intro fs-4">介紹: ${room.description}</p>
                    <div class="row align-items-center mb-4">
                        <div class="col-md-4 label-column">
                            <div class="text-center"><label for="select-date-search-moreRoomforStatus">日期:</label></div>
                            <input type="date" list="dates" class="form-control text-center" id="select-date-search-moreRoomforStatus">
                            <datalist id="dates"></datalist>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="startTimeSearch-moreRoomforStatus">開始時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="startTimeSearch-moreRoomforStatus"></select>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="endTimeSearch-moreRoomforStatus">結束時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="endTimeSearch-moreRoomforStatus"></select>
                        </div>
                    </div> 
                `;
            }
            $('#reservate-roomContainer').html(roomBody);
            $('#reservate-roomContainer-forStatus').html(roomBodyForStatus);
            $('#reservate-moreRoomContainer-forStatus').html(moreRoomBodyForStatus);
            initializeDateTimePicker('select-date-search', 'startTimeSearch', 'endTimeSearch');
            initializeDateTimePicker('select-date-search-forStatus', 'startTimeSearch-forStatus', 'endTimeSearch-forStatus');
            initializeDateTimePicker('select-date-search-moreRoomforStatus', 'startTimeSearch-moreRoomforStatus', 'endTimeSearch-moreRoomforStatus');

            const reservationInfo = {
                room: roomName,
            };

            $('#reservateRoom-success').on('click', function(event) {
                $('#alertContainer-reservateRoom-success').html('<div class="alert alert-success">預約成功</div>');
                reservateRoomForm(event, reservationInfo, 'select-date-search', 'startTimeSearch', 'endTimeSearch');
            });
            $('#reservateRoom-success-forStatus').on('click', function(event) {
                $('#alertContainer-reservateRoom-success-forStatus').html('<div class="alert alert-success">預約成功</div>');
                reservateRoomForm(event, reservationInfo, 'select-date-search-forStatus', 'startTimeSearch-forStatus', 'endTimeSearch-forStatus');
            });
            $('#reservate-success-moreRoomforStatus').on('click', function(event) {
                $('#alertContainer-reservateRoom-success-moreRoom-forStatus').html('<div class="alert alert-success">預約成功</div>');
                reservateRoomForm(event, reservationInfo, 'select-date-search-moreRoomforStatus', 'startTimeSearch-moreRoomforStatus', 'endTimeSearch-moreRoomforStatus');
            });
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
}

function reservationRoomContainer() {
    var locationSearchInput = document.getElementById("location").value;
    var dateSearchInput = document.getElementById("select-date").value;
    var startTimeSearchInput = document.getElementById("startTime").value;
    var endTimeSearchInput = document.getElementById("endTime").value;
    var minValue = document.getElementById('minValue').value;
    var maxValue = document.getElementById('maxValue').value;

    $.ajax({
        url: "http://localhost:3000/search-meeting-room",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({ 
            city: locationSearchInput, 
            date: dateSearchInput, 
            startTime: startTimeSearchInput, 
            endTime: endTimeSearchInput, 
            min: minValue, 
            max: maxValue 
        }),
        success: function(data) {
            let roomBody = '';
            data.forEach(room => {
                roomBody += `
                    <div class="col-md-4 col-sm-6 mb-4">
                        <div class="portfolio-item port">
                            <a class="portfolio-search-link" data-bs-toggle="modal" href="#reservation-room" data-room-name="${room.name}">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <img class="img-fluid-custom" src="${room.img}" alt="..." />
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading">${room.name}</div>
                                <div class="portfolio-caption-subheading text-muted">${room.status}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('#reservation-roomContainer').html(roomBody);

            const roomLinks = document.getElementsByClassName('portfolio-search-link');
            for (let i = 0; i < roomLinks.length; i++) {
                roomLinks[i].addEventListener('click', handleRoomClick);
            }
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
}

function moreRoomContainer() {
    $.ajax({
        url: "http://localhost:3000/meeting-room",
        dataType: 'json',
        success: function(data) {
            let roomBody = '';
            data.forEach(room => {
                roomBody += `
                    <div class="col-md-4 col-sm-6 mb-4">
                        <div class="portfolio-item port">
                            <a class="more-room-link" data-bs-toggle="modal" href="#reservation-more-room-forStatus" data-room-name="${room.name}">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <img class="img-fluid-custom" src="${room.img}" alt="..." />
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading">${room.name}</div>
                                <div class="portfolio-caption-subheading text-muted">${room.status}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('#more-roomContainer').html(roomBody);

            const moreRoomLinks = document.getElementsByClassName('more-room-link');
            for (let i = 0; i < moreRoomLinks.length; i++) {
                moreRoomLinks[i].addEventListener('click', handleRoomClick);
            }
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
}

function reservationEquipContainer() {
    var equipmentSearchInput = document.getElementById("equipmentInput").value;
    var dateSearchInput = document.getElementById("select-date-equipment").value;
    var startTimeSearchInput = document.getElementById("startTime-equipment").value;
    var endTimeSearchInput = document.getElementById("endTime-equipment").value;

    $.ajax({
        url: "http://localhost:3000/search-equipment",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({ 
            name: equipmentSearchInput, 
            date: dateSearchInput, 
            startTime: startTimeSearchInput, 
            endTime: endTimeSearchInput, 
            min: minValue, 
            max: maxValue 
        }),
        success: function(data) {
            let equipBody = '';
            data.forEach(equipment => {
                equipBody += `
                    <div class="col-md-4 col-sm-6 mb-4">
                        <div class="portfolio-item port">
                            <a class="portfolio-searchEquip-link" data-bs-toggle="modal" href="#reservation-equip" data-equipment-name="${equipment.name}">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <img class="img-fluid" src="${equipment.img}" alt="..." />
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading">${equipment.name}</div>
                                <div class="portfolio-caption-subheading text-muted">${equipment.status}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            $('#reservation-equipContainer').html(equipBody);

            const equipLinks = document.getElementsByClassName('portfolio-searchEquip-link');
            for (let i = 0; i < equipLinks.length; i++) {
                equipLinks[i].addEventListener('click', handleEquipClick);
            }
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
}

function moreEquipContainer() {
    $.ajax({
        url: "http://localhost:3000/equipment",
        dataType: 'json',
        success: function(data) {
            let equipBody = '';
            data.forEach(equipment => {
                equipBody += `
                    <div class="col-md-4 col-sm-6 mb-4">
                        <div class="portfolio-item port">
                            <a class="more-equip-link" data-bs-toggle="modal" href="#reservation-more-equip-forStatus" data-equipment-name="${equipment.name}">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <img class="img-fluid" src="${equipment.img}" alt="..." />
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading">${equipment.name}</div>
                                <div class="portfolio-caption-subheading text-muted">${equipment.status}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            $('#more-equipContainer').html(equipBody);

            const moreEquipLinks = document.getElementsByClassName('more-equip-link');
            for (let i = 0; i < moreEquipLinks.length; i++) {
                moreEquipLinks[i].addEventListener('click', handleEquipClick);
            }
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
}

function handleEquipClick(event) {
    event.preventDefault();
    const equipName = event.currentTarget.getAttribute('data-equipment-name');

    $.ajax({
        url: "http://localhost:3000/equipment",
        dataType: 'json',
        success: function(data) {
            let equipBody = '';
            let equipBodyForStatus = '';
            let moreEquipBodyForStatus = '';
            const equip = data.find(equip => equip.name == equipName);
            if (equip) {
                equipBody += `
                    <h2 class="text-uppercase">${equip.name}</h2>
                    <img class="img-fluid d-block mx-auto" src="${equip.img}" alt="..." />
                    <div class="row align-items-center mb-4">
                        <div class="col-md-4 label-column">
                            <div class="text-center"><label for="select-date-searchEquip">日期:</label></div>
                            <input type="date" list="dates" class="form-control text-center" id="select-date-searchEquip">
                            <datalist id="dates"></datalist>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="startTimeSearchEquip">開始時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="startTimeSearchEquip"></select>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="endTimeSearchEquip">結束時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="endTimeSearchEquip"></select>
                        </div>
                    </div>
                `;
                equipBodyForStatus += `
                    <h2 class="text-uppercase">${equip.name}</h2>
                    <img class="img-fluid d-block mx-auto" src="${equip.img}" alt="..." />
                    <div class="row align-items-center mb-4">
                        <div class="col-md-4 label-column">
                            <div class="text-center"><label for="select-date-searchEquip-forStatus">日期:</label></div>
                            <input type="date" list="dates" class="form-control text-center" id="select-date-searchEquip-forStatus">
                            <datalist id="dates"></datalist>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="startTimeSearchEquip-forStatus">開始時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="startTimeSearchEquip-forStatus"></select>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="endTimeSearchEquip-forStatus">結束時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="endTimeSearchEquip-forStatus"></select>
                        </div>
                    </div>
                `;
                moreEquipBodyForStatus += `
                    <h2 class="text-uppercase">${equip.name}</h2>
                    <img class="img-fluid d-block mx-auto" src="${equip.img}" alt="..." />
                    <div class="row align-items-center mb-4">
                        <div class="col-md-4 label-column">
                            <div class="text-center"><label for="select-date-moreEquip-forStatus">日期:</label></div>
                            <input type="date" list="dates" class="form-control text-center" id="select-date-moreEquip-forStatus">
                            <datalist id="dates"></datalist>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="startTimeMoreEquip-forStatus">開始時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="startTimeMoreEquip-forStatus"></select>
                        </div>
                        <div class="col-md-4 label-column">
                        <div class="text-center"><label for="endTimeMoreEquip-forStatus">結束時間:</label></div>
                            <select class="custom-form-select text-center flatpickr" id="endTimeMoreEquip-forStatus"></select>
                        </div>
                    </div>
                `;
                
            }
            $('#reservate-equipContainer').html(equipBody);
            $('#reservate-equipContainer-forStatus').html(equipBodyForStatus);
            $('#reservate-moreEquipContainer-forStatus').html(moreEquipBodyForStatus);
            initializeDateTimePicker('select-date-searchEquip', 'startTimeSearchEquip', 'endTimeSearchEquip');
            initializeDateTimePicker('select-date-searchEquip-forStatus', 'startTimeSearchEquip-forStatus', 'endTimeSearchEquip-forStatus');
            initializeDateTimePicker('select-date-moreEquip-forStatus', 'startTimeMoreEquip-forStatus', 'endTimeMoreEquip-forStatus');
            
            const reservationInfo = {
                name: equipName,
            };

            $('#reservateEquip-success').on('click', function(event) {
                $('#alertContainer-reservateEquip-success').html('<div class="alert alert-success">預約成功</div>');
                reservateEquipForm(event, reservationInfo, 'select-date-searchEquip', 'startTimeSearchEquip', 'endTimeSearchEquip');
            });
            $('#reservateEquip-success-forStatus').on('click', function(event) {
                $('#alertContainer-reservateEquip-success-forStatus').html('<div class="alert alert-success">預約成功</div>');
                reservateEquipForm(event, reservationInfo, 'select-date-searchEquip-forStatus', 'startTimeSearchEquip-forStatus', 'endTimeSearchEquip-forStatus');
            });
            $('#reservate-success-moreEquipforStatus').on('click', function(event) {
                $('#alertContainer-reservateRoom-success-moreEquip-forStatus').html('<div class="alert alert-success">預約成功</div>');
                reservateEquipForm(event, reservationInfo, 'select-date-moreEquip-forStatus', 'startTimeMoreEquip-forStatus', 'endTimeMoreEquip-forStatus');
            });
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
}

function getRandomNums(data, count) {
    let rooms = [...data];
    let selectedRooms = [];

    count = Math.min(count, rooms.length);

    for (let i = 0; i < count; i++) {
        let randomIndex = Math.floor(Math.random() * rooms.length);
        selectedRooms.push(rooms.splice(randomIndex, 1)[0]);
    }

    return selectedRooms;
}

let selectedRooms = null;
let selectedEquips = null;

// 讀取json檔案的會議室和設備
function roomContainer() {
    $.ajax({
        url: "http://localhost:3000/meeting-room",
        dataType: 'json',
        success: function(data) {
            let roomBody = '';
            if(!selectedRooms) selectedRooms = getRandomNums(data, 6);
            selectedRooms.forEach(room => {
                roomBody += `
                    <div class="col-md-4 col-sm-6 mb-4">
                        <div class="portfolio-item">
                            <a class="portfolio-link" data-bs-toggle="modal" href="#reservation-room-forStatus" data-room-name="${room.name}">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <img class="img-fluid-custom" src="${room.img}" alt="..." />
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading">${room.name}</div>
                                <div class="portfolio-caption-subheading text-muted">${room.status}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('#roomContainer').html(roomBody);

            const roomLinks_forStatus = document.getElementsByClassName('portfolio-link');
            for (let i = 0; i < roomLinks_forStatus.length; i++) {
                roomLinks_forStatus[i].addEventListener('click', handleRoomClick);
            }
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
}

function equipContainer() {
    $.ajax({
        url: "http://localhost:3000/equipment",
        dataType: 'json',
        success: function(data) {
            let equipBody = '';
            if(!selectedEquips) selectedEquips = getRandomNums(data, 6);
            data.forEach(equipment => {
                equipBody += `
                    <div class="col-md-4 col-sm-6 mb-4">
                        <div class="portfolio-item">
                            <a class="portfolio-link" data-bs-toggle="modal" href="#reservation-equip-forStatus" data-equipment-name="${equipment.name}">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content"><i class="fas fa-plus fa-3x"></i></div>
                                </div>
                                <img class="img-fluid" src="${equipment.img}" alt="..." />
                            </a>
                            <div class="portfolio-caption">
                                <div class="portfolio-caption-heading">${equipment.name}</div>
                                <div class="portfolio-caption-subheading text-muted">${equipment.status}</div>
                            </div>
                        </div>
                    </div>
                `;
            });
            $('#equipContainer').html(equipBody);

            const equipLinks_forStatus = document.getElementsByClassName('portfolio-link');
            for (let i = 0; i < equipLinks_forStatus.length; i++) {
                equipLinks_forStatus[i].addEventListener('click', handleEquipClick);
            }
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }
    });
    initializeDateTimePicker();
}


function reservate_room() {       
    // $('#reservateRoom-success').on('click', function(event) {
    //     event.preventDefault();
    //     $('#alertContainer-reservateRoom-success').html('<div class="alert alert-success">預約成功</div>');
    //     const roomLinks = document.getElementsByClassName('portfolio-link');
    //     for (let i = 0; i < roomLinks.length; i++) {
    //         roomLinks[i].addEventListener('click', reservateForm);
    //     }
    // });

    // function handleReservation(event) {
    //     event.preventDefault();
    //     $('#alertContainer-reservateRoom-success-forStatus').html('<div class="alert alert-success">預約成功</div>');
    //     reservateForm(event);
    // }

    // $('#reservateRoom-success-forStatus').off('click').on('click', handleReservation);

    
    // const roomLinks_forStatus = document.getElementsByClassName('portfolio-link');
    // for (let i = 0; i < roomLinks_forStatus.length; i++) {
    //     roomLinks_forStatus[i].addEventListener('click', function(event) {
    //         console.log('success');
    //         const reservationInfo = {
    //             room: this.getAttribute('data-room-name'),
    //         };

    //         console.log('Reservation info:', reservationInfo);
    
    //         $('#reservateRoom-success-forStatus').off('click').on('click', function(event) {
    //             handleReservation(event, reservationInfo);
    //         });
    //     });
    // }

    // $('#reservateEquip-success').on('click', function(event) {
    //     event.preventDefault();
    //     $('#alertContainer-reservateEquip-success').html('<div class="alert alert-success">預約成功</div>');
    //     const equipLinks = document.getElementsByClassName('portfolio-link');
    //     for (let i = 0; i < equipLinks.length; i++) {
    //         equipLinks[i].addEventListener('click', reservateForm);
    //     }
    // });

    // $('#reservateEquip-success-forStatus').on('click', function(event) {
    //     event.preventDefault();
    //     $('#alertContainer-reservateEquip-success-forStatus').html('<div class="alert alert-success">預約成功</div>');
    //     const equipLinks_forStatus = document.getElementsByClassName('portfolio-link');
    //     for (let i = 0; i < equipLinks_forStatus.length; i++) {
    //         equipLinks_forStatus[i].addEventListener('click', reservateForm);
    //     }
    // });
}

function reservateRoomForm(event, reservationInfo, date, startTime, endTime) {
    var date = document.getElementById(date).value;
    var startTime = document.getElementById(startTime).value;
    var endTime = document.getElementById(endTime).value;

    $.ajax({
        url: "http://localhost:3000/add-new-room-reservation",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({ 
            reservationInfo: reservationInfo.room,
            date: date,
            startTime: startTime,
            endTime: endTime
        }),
        success: function(data) {
            
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }  
    });
}

function reservateEquipForm(event, reservationInfo, date, startTime, endTime) {
    var date = document.getElementById(date).value;
    var startTime = document.getElementById(startTime).value;
    var endTime = document.getElementById(endTime).value;

    $.ajax({
        url: "http://localhost:3000/add-new-equip-reservation",
        type: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({ 
            reservationInfo: reservationInfo.name,
            date: date,
            startTime: startTime,
            endTime: endTime
        }),
        success: function(data) {
            
        },
        error: function(error) {
            console.error('Error loading JSON data', error);
        }  
    });
}

function displayUserTable() {
    const rowsPerPage = 20;
    let currentPage = 1;
    let userData = [];
    
    function userTable() {    
        $.ajax({
            url: "http://localhost:3000/user",
            dataType: 'json',
            success: function(data) {
                userData = data;
                renderTable_user();
                renderPagination_user();
            },
            error: function(error) {
                console.error('Error loading JSON data', error);
            }
        });
    }

    function renderTable_user() {
        let tableBody = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = userData.slice(start, end);
        
        pageData.forEach((user,id) => {
            tableBody += `
                <tr>
                    <td>${start + id + 1}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${btoa(user.password)}</td>
                    <td>${user.permission}</td>
                    <td><button class="btn btn-primary btn-l" 
                                data-bs-toggle="modal" 
                                href="#modify-user-page"
                                onclick="modify_user_page_display(this)"
                                data-name="${user.name}"
                                data-email="${user.email}"
                                data-password="${user.password}"
                                data-permission="${user.permission}">
                            修改
                        </button>
                    </td>
                    <td><button class="btn btn-secondary btn-l" 
                                onclick="deleteRowUser(this)"
                                data-name="${user.name}"
                                data-email="${user.email}"
                                data-password="${user.password}"
                                data-permission="${user.permission}">
                            停權
                        </button>
                    </td>
                </tr>
            `;
        });
        $('#userTable').html(tableBody);
    }

    function renderPagination_user() {
        const pagination = $('#pagination');
        pagination.empty();

        const totalPages = Math.ceil(userData.length / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            pagination.append(`
                <button class="pageBtn btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" onclick="changePage(${i})">${i}</button>
            `);
        }
    }

    window.changePage = function(page) {
        currentPage = page;
        renderTable_user();
        renderPagination_user();
    }

    window.deleteRowUser = function(button) {
        const row = button.closest('tr');
        const userName = button.getAttribute('data-name');
        const userEmail = button.getAttribute('data-email');
        const userPassword = button.getAttribute('data-password');
        const userPermission = button.getAttribute('data-permission');

        $.ajax({
            url: "http://localhost:3000/delete-user",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                name: userName,
                email: userEmail,
                password: userPassword,
                permission: userPermission
             }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
                row.remove();
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });

        renderTable_user();
        renderPagination_user();
    }

    window.modifyUser = function(button) {
        
    }

    userTable();
}

function addUser() {
    $('#add-user').on('click', function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const permission = document.getElementById('permission').value;

        if(!name || !email || !password || !permission) {
            alert('請填寫完整');
            return;
        }

        $.ajax({
            url: "http://localhost:3000/add-user",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                name: name,
                email: email,
                password: password,
                permission: permission
             }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });
    });
}

function modify_user_page_display(button) {
    const userName = button.getAttribute('data-name');
    const userEmail = button.getAttribute('data-email');
    const userPassword = button.getAttribute('data-password');
    const userPermission = button.getAttribute('data-permission');

    let formBody = '';
    formBody += `
        <form id="modify">
            <div class="row align-items-center">
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-name" class="col-md-2">姓名:</label>
                    <input type="text" class="form-control" id="modify-name" name="name" value="${userName}" required>
                </div>
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-email" class="col-md-2">信箱:</label>
                    <input type="email" class="form-control" id="modify-email" name="email" value="${userEmail}" required>
                </div>
            </div>
            <div class="row align-items-center form-group-inline mb-2">
                <div class="form-group col-md-6 d-flex align-items-center">
                    <label for="modify-password" class="col-md-2">密碼:</label>
                    <input type="text" class="form-control" id="modify-password" name="password" value="${userPassword}" required>
                </div>
                <div class="form-group col-md-6 d-flex align-items-center">
                    <label for="modify-permission" class="col-md-2">權限:</label>
                    <select class="form-select" id="modify-permission">
                        <option value="user" ${userPermission === 'user' ? 'selected' : ''}>user</option>
                        <option value="admin" ${userPermission === 'admin' ? 'selected' : ''}>admin</option>
                    </select>
                </div>
            </div>
            <div class="text-center">
                <button class="btn btn-primary btn-xl mb-4" id="modify-button" type="submit">完成</button>
            </div>
        </form>
    `;
    
    $('#modify-user-form').html(formBody);

    modify_button_click();
}

function modify_button_click() {
    $('#modify-button').on('click', function(event) {
        event.preventDefault();
        const modifyName = document.getElementById('modify-name').value;
        const modifyEmail = document.getElementById('modify-email').value;
        const modifyPassword = document.getElementById('modify-password').value;
        const modifyPermission = document.getElementById('modify-permission').value;

        $.ajax({
            url: "http://localhost:3000/modify-user",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                name: modifyName,
                email: modifyEmail,
                password: modifyPassword,
                permission: modifyPermission
             }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });
    });
}

function changePage() {
    $('#user-management-link').on('click', function(event) {
        localStorage.setItem('page', 'true');
        const whichPage = localStorage.getItem('page');
        checkPageStatus(whichPage);
    });

    $('#reservation-management-link').on('click', function(event) {
        localStorage.setItem('page', 'false');
        const whichPage = localStorage.getItem('page');
        checkPageStatus(whichPage);
    });

    const whichPage = localStorage.getItem('page');
    checkPageStatus(whichPage);
}

function checkPageStatus(whichPage) {
    if (whichPage === 'true' || whichPage === null) {
        document.getElementById('user-management').hidden = false;
        document.getElementById('reservation-management').hidden = true;
    } else {
        document.getElementById('user-management').hidden = true;
        document.getElementById('reservation-management').hidden = false;
    }
}

function displayRoomReservationTable() {
    const rowsPerPage = 10;
    let currentPage = 1;
    let roomReservationData = [];
    
    function roomReservationTable() {    
        $.ajax({
            url: "http://localhost:3000/room-reservation",
            dataType: 'json',
            success: function(data) {
                roomReservationData = data;
                renderTable_roomReservation();
                renderPagination_roomReservation();
            },
            error: function(error) {
                console.error('Error loading JSON data', error);
            }
        });
    }

    function renderTable_roomReservation() {
        let tableBody = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = roomReservationData.slice(start, end);
        
        pageData.forEach((reservation,id) => {
            tableBody += `
                <tr>
                    <td>${start + id + 1}</td>
                    <td>${reservation.user}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.startTime}</td>
                    <td>${reservation.endTime}</td>
                    <td>${reservation.name}</td>
                    <td>${reservation.address}</td>
                    <td>${reservation.status}</td>
                    <td>
                        <button class="btn btn-primary btn-l" 
                                data-bs-toggle="modal" 
                                href="#modify-room-reservation"
                                onclick="modifyRoomReservation(this)"
                                data-user="${reservation.user}"
                                data-date="${reservation.date}"
                                data-startTime="${reservation.startTime}"
                                data-endTime="${reservation.endTime}"
                                data-name="${reservation.name}"
                                data-address="${reservation.address}"
                                data-status="${reservation.status}">
                            修改
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-l" 
                                onclick="deleteRoomReservation(this)"
                                data-user="${reservation.user}"
                                data-date="${reservation.date}"
                                data-startTime="${reservation.startTime}"
                                data-endTime="${reservation.endTime}"
                                data-name="${reservation.name}"
                                data-address="${reservation.address}"
                                data-status="${reservation.status}">
                            刪除
                        </button>
                    </td>
                </tr>
            `;
        });
        $('#roomReservationTable').html(tableBody);
    }

    function renderPagination_roomReservation() {
        const pagination = $('#paginationRoomTable');
        pagination.empty();

        const totalPages = Math.ceil(roomReservationData.length / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            pagination.append(`
                <button class="pageBtn btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" onclick="changePageRoomTable(${i})">${i}</button>
            `);
        }
    }

    window.changePageRoomTable = function(page) {
        currentPage = page;
        renderTable_roomReservation();
        renderPagination_roomReservation();
    }

    window.deleteRoomReservation = function(button) {
        const row = button.closest('tr');
        const roomReservationUser = button.getAttribute('data-user');
        const roomReservationDate = button.getAttribute('data-date');
        const roomReservationStartTime = button.getAttribute('data-startTime');
        const roomReservationEndTime = button.getAttribute('data-endTime');
        const roomReservationName = button.getAttribute('data-name');
        const roomReservationAddress = button.getAttribute('data-address');
        const roomReservationStatus = button.getAttribute('data-status');

        $.ajax({
            url: "http://localhost:3000/delete-room-reservation",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                user: roomReservationUser,
                date: roomReservationDate,
                startTime: roomReservationStartTime,
                endTime: roomReservationEndTime,
                name: roomReservationName,
                address: roomReservationAddress,
                status: roomReservationStatus
             }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
                row.remove();
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });

        renderTable_roomReservation();
        renderPagination_roomReservation();
    }

    roomReservationTable();
}

function modifyRoomReservation(button) {
    const roomReservationUser = button.getAttribute('data-user');
    const roomReservationDate = button.getAttribute('data-date');
    const roomReservationStartTime = button.getAttribute('data-startTime');
    const roomReservationEndTime = button.getAttribute('data-endTime');
    const roomReservationName = button.getAttribute('data-name');
    const roomReservationAddress = button.getAttribute('data-address');
    const roomReservationStatus = button.getAttribute('data-status');

    let modifyRoomReservationFormBody = '';
    modifyRoomReservationFormBody += `
        <form id="modify">
            <div class="row align-items-center">
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-user" class="col-md-4">使用者:</label>
                    <input type="text" class="form-control text-center" id="modify-user" name="name" value="${roomReservationUser}">
                </div>
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-date" class="col-md-4">日期:</label>
                    <input type="date" list="dates" class="form-control text-center" id="modify-date" value="${roomReservationDate}">
                    <datalist id="dates"></datalist>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-startTime" class="col-md-4">開始時間:</label>
                    <select class="custom-form-select text-center flatpickr" id="modify-startTime"></select>
                </div>
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-endTime" class="col-md-4">結束時間:</label>
                    <select class="custom-form-select text-center flatpickr" id="modify-endTime"></select>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-name" class="col-md-4">會議室:</label>
                    <input type="text" class="form-control text-center" id="modify-name" name="name" value="${roomReservationName}">
                </div>
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-address" class="col-md-4">地址:</label>
                    <input type="text" class="form-control text-center" id="modify-address" value="${roomReservationAddress}">
                </div>
            </div>
            <div class="row align-items-center">
                <div class="form-group col-md-12 d-flex align-items-center mb-2">
                    <label for="modify-status" class="col-md-2">狀態: </label>
                    <select class="form-select text-center" id="modify-status">
                        <option value="尚未結束" ${roomReservationStatus === '尚未結束' ? 'selected' : ''}>尚未結束</option>
                        <option value="已結束" ${roomReservationStatus === '已結束' ? 'selected' : ''}>已結束</option>
                        <option value="已取消" ${roomReservationStatus === '已取消' ? 'selected' : ''}>已取消</option>
                    </select>
                </div>
            </div>
            <div class="text-center">
                <button class="btn btn-primary btn-xl mb-4" id="modify-room-reservation-button" type="submit">完成</button>
            </div>
        </form>
    `;
    
    $('#modify-room-reservation-form').html(modifyRoomReservationFormBody);

    modify_button_click();
    modifyStartTimeAndEndTime(roomReservationStartTime, roomReservationEndTime, 'modify-date', 'modify-startTime', 'modify-endTime');
}

function modify_button_click() {
    $('#modify-room-reservation-button').on('click', function(event) {
        event.preventDefault();
        const modifyUser = document.getElementById('modify-user').value;
        const modifyDate = document.getElementById('modify-date').value;
        const modifyStartTime = document.getElementById('modify-startTime').value;
        const modifyEndTime = document.getElementById('modify-endTime').value;
        const modifyName = document.getElementById('modify-name').value;
        const modifyAddress = document.getElementById('modify-address').value;
        const modifyStatus = document.getElementById('modify-status').value;

        $.ajax({
            url: "http://localhost:3000/modify-room-reservation",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                user: modifyUser,
                date: modifyDate,
                startTime: modifyStartTime,
                endTime: modifyEndTime,
                name: modifyName,
                address: modifyAddress,
                status: modifyStatus
             }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });
    });
}

function modifyStartTimeAndEndTime(reservationStartTime, reservationEndTime, date, startTime, endTime) {
    var now = new Date();
    var dateInput = document.getElementById(date);

    var selectedDate = new Date(dateInput.value);
    var selectStartTime = document.getElementById(startTime);
    var selectEndTime = document.getElementById(endTime);
    
    // Clear previous options
    selectStartTime.innerHTML = '';
    selectEndTime.innerHTML = '';
    
    if (selectedDate.toISOString().split('T')[0] === now.toISOString().split('T')[0]) {
        let getHours = now.getHours();
        let getMinutes = now.getMinutes() > 30 ? 0 : 30;

        if (now.getMinutes() > 30) {
            getHours += 1;
        }

        addOptions(getHours, getMinutes, selectStartTime);       
        addOptions(getHours, getMinutes, selectEndTime);
    } else {
        addOptions(0, 0, selectStartTime);
        addOptions(0, 0, selectEndTime);
    }

    Array.from(selectStartTime.options).forEach(option => {
        if (option.value === reservationStartTime) {
            option.selected = true;
        }
    });

    Array.from(selectEndTime.options).forEach(option => {
        if (option.value === reservationEndTime) {
            option.selected = true;
        }
    });


    document.getElementById(startTime).addEventListener('change', function() {
        var selectEndTime = document.getElementById(endTime);
        selectEndTime.innerHTML = '';
        var startTimeValue = selectStartTime.value;
        var [startHour, startMinute] = startTimeValue.split(':').map(Number);

        // Add options for end time starting from the selected start time + 30 minutes
        if (startMinute === 30) {
            startHour += 1;
            startMinute = 0;
        } else {
            startMinute = 30;
        }
        addOptions(startHour, startMinute, selectEndTime);

        Array.from(selectEndTime.options).forEach(option => {
            if (option.value === reservationEndTime) {
                option.selected = true;
            }
        });
    });
}

function displayEquipReservationTable() {
    const rowsPerPage = 10;
    let currentPage = 1;
    let equipReservationData = [];
    
    function equipReservationTable() {    
        $.ajax({
            url: "http://localhost:3000/equip-reservation",
            dataType: 'json',
            success: function(data) {
                equipReservationData = data;
                renderTable_equipReservation();
                renderPagination_equipReservation();
            },
            error: function(error) {
                console.error('Error loading JSON data', error);
            }
        });
    }

    function renderTable_equipReservation() {
        let tableBody = '';
        const start = (currentPage - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageData = equipReservationData.slice(start, end);
        
        pageData.forEach((reservation,id) => {
            tableBody += `
                <tr>
                    <td>${start + id + 1}</td>
                    <td>${reservation.user}</td>
                    <td>${reservation.date}</td>
                    <td>${reservation.startTime}</td>
                    <td>${reservation.endTime}</td>
                    <td>${reservation.equipment}</td>
                    <td>${reservation.status}</td>
                    <td>
                        <button class="btn btn-primary btn-l" 
                                data-bs-toggle="modal" 
                                href="#modify-equip-reservation"
                                onclick="modifyEquipReservation(this)"
                                data-user="${reservation.user}"
                                data-date="${reservation.date}"
                                data-startTime="${reservation.startTime}"
                                data-endTime="${reservation.endTime}"
                                data-equipment="${reservation.equipment}"
                                data-status="${reservation.status}">
                            修改
                        </button>
                    </td>
                    <td>
                        <button class="btn btn-secondary btn-l" 
                                onclick="deleteEquipReservation(this)"
                                data-user="${reservation.user}"
                                data-date="${reservation.date}"
                                data-startTime="${reservation.startTime}"
                                data-endTime="${reservation.endTime}"
                                data-equipment="${reservation.equipment}"
                                data-status="${reservation.status}">
                            刪除
                        </button>
                    </td>
                </tr>
            `;
        });
        $('#equipReservationTable').html(tableBody);
    }

    function renderPagination_equipReservation() {
        const pagination = $('#paginationEquipTable');
        pagination.empty();

        const totalPages = Math.ceil(equipReservationData.length / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            pagination.append(`
                <button class="pageBtn btn ${i === currentPage ? 'btn-primary' : 'btn-secondary'}" onclick="changePageEquipTable(${i})">${i}</button>
            `);
        }
    }

    window.changePageEquipTable = function(page) {
        currentPage = page;
        renderTable_equipReservation();
        renderPagination_equipReservation();
    }

    window.deleteEquipReservation = function(button) {
        const row = button.closest('tr');
        const equipReservationUser = button.getAttribute('data-user');
        const equipReservationDate = button.getAttribute('data-date');
        const equipReservationStartTime = button.getAttribute('data-startTime');
        const equipReservationEndTime = button.getAttribute('data-endTime');
        const equipReservationEquipment = button.getAttribute('data-equipment');
        const equipReservationStatus = button.getAttribute('data-status');

        $.ajax({
            url: "http://localhost:3000/delete-equip-reservation",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                user: equipReservationUser,
                date: equipReservationDate,
                startTime: equipReservationStartTime,
                endTime: equipReservationEndTime,
                equipment: equipReservationEquipment,
                status: equipReservationStatus
             }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
                row.remove();
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });

        renderTable_equipReservation();
        renderPagination_equipReservation();
    }

    equipReservationTable();
}

function modifyEquipReservation(button) {
    const equipReservationUser = button.getAttribute('data-user');
    const equipReservationDate = button.getAttribute('data-date');
    const equipReservationStartTime = button.getAttribute('data-startTime');
    const equipReservationEndTime = button.getAttribute('data-endTime');
    const equipReservationEquipment = button.getAttribute('data-equipment');
    const equipReservationStatus = button.getAttribute('data-status');

    let modifyEquipReservationFormBody = '';
    modifyEquipReservationFormBody += `
        <form id="modify">
            <div class="row align-items-center">
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-equip-user" class="col-md-4">使用者:</label>
                    <input type="text" class="form-control text-center" id="modify-equip-user" name="name" value="${equipReservationUser}">
                </div>
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-equip-date" class="col-md-4">日期:</label>
                    <input type="date" list="dates" class="form-control text-center" id="modify-equip-date" value="${equipReservationDate}">
                    <datalist id="dates"></datalist>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-equip-startTime" class="col-md-4">開始時間:</label>
                    <select class="custom-form-select text-center flatpickr" id="modify-equip-startTime"></select>
                </div>
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-equip-endTime" class="col-md-4">結束時間:</label>
                    <select class="custom-form-select text-center flatpickr" id="modify-equip-endTime"></select>
                </div>
            </div>
            <div class="row align-items-center">
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-equip-name" class="col-md-4">會議室:</label>
                    <input type="text" class="form-control text-center" id="modify-equip-name" name="name" value="${equipReservationEquipment}">
                </div>
                <div class="form-group col-md-6 d-flex align-items-center mb-2">
                    <label for="modify-equip-status" class="col-md-4">狀態: </label>
                    <select class="form-select text-center" id="modify-equip-status">
                        <option value="尚未歸還" ${equipReservationStatus === '尚未歸還' ? 'selected' : ''}>尚未歸還</option>
                        <option value="已結束" ${equipReservationStatus === '已歸還' ? 'selected' : ''}>已歸還</option>
                        <option value="已取消" ${equipReservationStatus === '已取消' ? 'selected' : ''}>已取消</option>
                    </select>
                </div>
            </div>
            <div class="text-center">
                <button class="btn btn-primary btn-xl mb-4" id="modify-equip-reservation-button" type="submit">完成</button>
            </div>
        </form>
    `;
    
    $('#modify-equip-reservation-form').html(modifyEquipReservationFormBody);

    modify_equip_button_click();
    modifyStartTimeAndEndTime(equipReservationStartTime, equipReservationEndTime, 'modify-equip-date', 'modify-equip-startTime', 'modify-equip-endTime');
}

function modify_equip_button_click() {
    $('#modify-equip-reservation-button').on('click', function(event) {
        event.preventDefault();
        const modifyEquipUser = document.getElementById('modify-equip-user').value;
        const modifyEquipDate = document.getElementById('modify-equip-date').value;
        const modifyEquipStartTime = document.getElementById('modify-equip-startTime').value;
        const modifyEquipEndTime = document.getElementById('modify-equip-endTime').value;
        const modifyEquipment = document.getElementById('modify-equip-name').value;
        const modifyEquipStatus = document.getElementById('modify-equip-status').value;

        $.ajax({
            url: "http://localhost:3000/modify-equip-reservation",
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 
                user: modifyEquipUser,
                date: modifyEquipDate,
                startTime: modifyEquipStartTime,
                endTime: modifyEquipEndTime,
                equipment: modifyEquipment,
                status: modifyEquipStatus
             }),
            dataType: 'json',
            success: function(data) {
                console.log('Status updated successfully', data);
            },
            error: function(error) {
                console.error('Error updating status', error);
            }
        });
    });
}