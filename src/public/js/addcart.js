function addCart(slug) {
    $.ajax({
        url: `/buyer/addCart`,
        method: 'POST',
        data: {
            slug: slug,
        },
        success: (msg) => {
            if (typeof msg == 'number') {
                Toast({
                    style: 1,
                    title: 'Đã thêm vào giỏ hàng',
                    type: 'success',
                    duration: 2000,
                });

                $('.num-dot.cart').html(msg)
            } else if (msg == 'error') {
                Toast({
                    style: 1,
                    title: 'Mặt hàng này đã hết!',
                    type: 'error',
                    duration: 2000,
                });
            } else {
                window.location.href = '/account/login';
            }
        },
        error: (error) => {
            Toast({
                style: 1,
                title: 'Đã xảy ra lỗi',
                message: '',
                type: 'error',
                duration: 3000,
            });
        },
    });
}

function outOfStock() {
    Toast({
        style: 1,
        title: 'Mặt hàng này đã hết!',
        message: '',
        type: 'error',
        duration: 3000,
    });
}