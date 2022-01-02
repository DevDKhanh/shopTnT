(function () {
    const btnSelectOption = document.querySelectorAll('.option-auth');
    const formAuth = document.querySelector('.form-auth-option');
    const htmlLogin = `
    <form class="form-submit-login" method="POST">
        <div class="form-group">
            <label class="title" for="">Tên tài khoản/Gmail</label>
            <div class="input-group">
                <input autocomplete=off class="form-element" name="username" id="userlogin" type="text" placeholder="Nhập tên đăng nhập hoặc gmail">
            </div>
        </div>
        <div class="form-group">
            <label class="title" for="">Mật khẩu</label>
            <div class="input-group">
                <input autocomplete=off class="form-element" name="password" id="passlogin" type="password" placeholder="Nhập mật khẩu">
            </div>
        </div>
        <div class="mt-2 mb-4">
            <input autocomplete=off type="checkbox" name="" id="remeber-pass"> <label style="color: #4b566b;" for="remeber-pass">Ghi nhớ mật khẩu</label>
        </div>
        <div class="form-group">
            <div class="input-group">
                <button class="btn form-btn btn-color-pink btn-login" >Đăng nhập</button>
            </div>
        </div>
    </form>
    <div class="text-center mt-2 mb-1"><b>Hoặc</b></div>
    <div class="form-group">
        <div class="login-social">
            <a href="/account/facebook"  class="btn btn-social btn-handle"><i class="fab fa-facebook"></i> Đăng nhập facebook</a>
            <a href="/account/google" class="btn btn-social btn-handle"><img src="/img/google.jpg" alt=""> Đăng nhập google</a>
        </div>
    </div>
    `;
    const htmlSignup = `
    <form class="form-submit-sign" method="POST">
        <div class="form-group">
            <label class="title" for="">Tên tài khoản</label>
            <div class="input-group">
                <input autocomplete=off class="form-element" id="username" name="username" type="text" placeholder="VD: example">
            </div>
        </div>
        <div class="form-group">
            <label class="title" for="">Số điện thoại</label>
            <div class="input-group">
                <input autocomplete=off class="form-element" id="phone" name="phone" type="text" placeholder="(+84)">
            </div>
        </div>
        <div class="form-group">
            <label class="title" for="">Mật khẩu</label>
            <div class="input-group">
                <input autocomplete=off class="form-element" id="password-pass1" name="password-pass1" type="password">
            </div>
        </div>
        <div class="form-group">
            <label class="title" for="">Nhập lại mật khẩu</label>
            <div class="input-group">
                <input autocomplete=off class="form-element" id="password-pass2" name="password-pass2" type="password">
            </div>
        </div>
        <div class="form-group">
            <div class="input-group">
                <button class="btn btn-color-pink btn-sign box-shadow-none"><i class="fas fa-user-circle"></i> Đăng ký</button>
            </div>
        </div>
    </form>
    `;
    btnSelectOption.forEach((element, index) => {
        element.onclick = () => {
            document
                .querySelector('.option-auth.active')
                .classList.remove('active');
            element.classList.add('active');
            if (index == 0) {
                formAuth.innerHTML = htmlLogin;
                submitLogin();
            } else {
                formAuth.innerHTML = htmlSignup;
                submitSignUp();
            }
        };
    });
    function submitSignUp() {
        $('.btn-sign ').click((e) => {
            e.preventDefault();
            const nameuser = $('#username').val();
            const phone = $('#phone').val();
            const password_1 = $('#password-pass1').val();
            const password_2 = $('#password-pass2').val();
            $.ajax({
                url: '/account/signup',
                method: 'POST',
                data: {
                    nameuser: nameuser,
                    phone: phone,
                    password_1: password_1,
                    password_2: password_2,
                },
                success: (msg) => {
                    if (msg == 'success') {
                        $('.option-auth.active').removeClass('active');
                        $('.option-auth.login').addClass('active');
                        Toast({
                            title: 'Thành công',
                            message: 'Đăng ký thành công tài khoản',
                            type: 'success',
                            duration: 1600,
                        });
                        formAuth.innerHTML = htmlLogin;
                    } else {
                        Toast({
                            title: 'Cảnh báo',
                            message: msg,
                            type: 'warn',
                            duration: 1600,
                        });
                    }
                },
                error: (error) => {
                    Toast({
                        title: 'Có lỗi',
                        message: error,
                        type: 'error',
                        duration: 1600,
                    });
                },
            });
        }); 

        $('.btn-handle').click(()=> {
            Toast({
                style: 2,
                duration: 60000,
            })
        })
    }

    function submitLogin() {
        $('.btn-login').click((e) => {
            e.preventDefault();
            const nameuser = $('#userlogin').val();
            const password = $('#passlogin').val();
            $.ajax({
                url: '/account/login',
                method: 'POST',
                data: {
                    nameuser: nameuser,
                    password: password,
                },
                success: (msg) => {
                    if (msg == 'success') {
                        $('.check-auth').hide();
                        Toast({
                            style: 1,
                            title: 'Đăng nhập thành công',
                            type: 'success',
                            duration: 1600,
                        });
                        setTimeout(() => {
                            localStorage.getItem('pathname')
                                ? (window.location.href =
                                      localStorage.getItem('pathname'))
                                : (window.location.href = '/');
                        }, 1000);
                    } else {
                        Toast({
                            title: 'Thất bại',
                            message: msg,
                            type: 'error',
                            duration: 2000,
                        });
                    }
                },
                error: (error) => {
                    Toast({
                        title: 'Thất bại',
                        message: error,
                        type: 'error',
                        duration: 1600,
                    });
                },
            });
        });

        $('.btn-handle').click(()=> {
            Toast({
                style: 2,
                duration: 60000,
            });
        });
    }

    window.onload = () => {
        submitLogin();
    };
    
    let iScrollPos = 0;
    $(window).scroll(function () {
    let iCurScrollPos = $(this).scrollTop();
    if (iCurScrollPos < iScrollPos) {
        const menu = document.querySelector('.nav-menu.active');
            if (menu) menu.classList.remove('active')
    } else {
        if($(this).scrollTop()<=60){
            const menu = document.querySelector('.nav-menu.active');
            if (menu) menu.classList.remove('active')
        }else{
            const menu = document.querySelector('.nav-menu');
            if (menu) menu.classList.add('active');
        }
    }
    iScrollPos = iCurScrollPos;
    });
})();
