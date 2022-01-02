(function(){
    const API = `/api/order/me`;

    let sort = 'isAll';

    function start() {
        getOrders(renderView);
        getOrders(countProduct);
    }
    start();

    function getOrders(callback) {
        fetch(API)
        .then(response => response.json())
        .then(callback)
    }

    function renderView(data) {
        let html;
        if(data.length > 0) {
            htmls = data.map(order=> {
                if (sort == "isAll") {
                    return htmlOrder(order);
                } else if (order.isCancel && sort == "isCancel") {
                    return htmlOrder(order);
                } else if (order.isCheck && !order.isShipping && sort == "isCheck") {
                    return htmlOrder(order);
                } else if (order.isShipping && !order.isDone && sort == "isShipping") {
                    return htmlOrder(order);
                } else if (order.isDone && sort == "isDone") {
                    return htmlOrder(order);
                } else {
                    return null
                }
            });

            htmls.join('')? $('.main-order').html(htmls):
            $('.main-order').html(
                `<div class="empty-cart">
                   <div class="title"> Bạn không có đơn hàng nào ở mục này </div>
                </div>`
            );
        } else {
            htmls = `
                <div class="empty-cart">
                    <img src="/img/empty-cart.png"/>
                    <a href="/me/cart" class="btn btn-back">Đặt hàng ngay</a>
                </div>`;
            $('.main-order').html(htmls)
        }
        event();
    }


    function viewListProduct(list) {
        return list.map( product => {
            return `
            <div class="cart-item">
                <div class="cart-item-zone-1">
                    <div class="cart-item__img">
                        <img src="${product.img}" alt="">
                    </div>
                    <div class="cart-item_name">
                        ${product.nameProduct}
                    </div>
                </div>
                <div class="cart-item-zone-2">
                    <div class="cart-item__price">
                        <div class="price">${Number(product.price).toLocaleString('da-DK')} VNĐ</div> 
                        <div class="quantity">X${product.quantity}</div> 
                    </div>
                </div>
            </div>
            `
        });
    }

    function event() {
        $('.order-control__btn').click((e)=> {
            dialog({
                title: 'Bạn chắc chắn muốn hủy đơn này?',
                textBtn: 'Hủy ngay',
                cancelBtn: 'Từ chối',
                action: ()=> {
                    $.ajax({
                        url: `/buyer/cancel-order`,
                        method: 'PUT',
                        data: {
                            id: e.target.dataset.id,
                        },
                        success: (msg) => {
                            if (typeof msg == 'number') {
                                Toast({
                                    style: 1,
                                    title: 'Đã hủy đơn',
                                    message: 'Hủy đơn hàng thành công',
                                    type: 'info',
                                    duration: 4000
                                });
                                $('.num-dot.order').html(msg);
                                getOrders(renderView);
                                getOrders(countProduct);
                            }
                            else {
                                Toast({
                                    title: 'Hủy đơn thất bại',
                                    message: 'Vui lòng liên hệ người bán',
                                    type: 'error',
                                    duration: 1400
                                });
                            }
                        },
                        error(data) {
                            Toast({
                                title: 'Đã có lỗi',
                                message: 'Không thể hủy đơn hàng',
                                type: 'error',
                                duration: 1400,
                            });
                        }
                    });
                }
            });
        });

        $('.btn-re-order').click((e)=> {
            $.ajax({
                url: `/buyer/re-order`,
                method: 'PUT',
                data: {
                    id: e.target.dataset.id,
                },
                success: (msg) => {
                    if (typeof msg == 'number') {
                        Toast({
                            style: 1,
                            title: 'Đặt hàng thành công',
                            type: 'success',
                            duration: 2000
                        });
                        $('.num-dot.order').html(msg);
                        getOrders(renderView);
                        getOrders(countProduct);
                    }
                    else {
                        Toast({
                            title: 'Có lỗi xảy',
                            message: 'Vui lòng thử lại sau!',
                            type: 'error',
                            duration: 1400
                        });
                    }
                },
                error(data) {
                    Toast({
                        title: 'Đã có lỗi',
                        message: 'Vui lòng thử lại saU!',
                        type: 'error',
                        duration: 1400,
                    });
                }
            });
        })
    }

    $('.btn-sort-order').click((e)=>{
            $('.btn-sort-order.active').removeClass('active');
            e.currentTarget.classList.add('active')
            sort = e.currentTarget.dataset.sort;
            getOrders(renderView);
            getOrders(countProduct);
        })

    function htmlOrder(order=null) {
        if (order) {
             return `
            <div class="list-orders">
                <div class="item-order">
                    <div class="order-status">
                        ${order.isCancel?'Đã hủy'
                        :order.isShipping?order.isDone?`Đã nhận hàng`:'<i class="fas fa-dolly-flatbed"></i> Đang giao hàng'
                        :order.isCheck?`Đang lấy hàng <i class="fas fa-check-double"></i>`
                        :`Đang chờ xác nhận`}
                    </div>
                    <div class="order-info">
                        ${viewListProduct(order.listProduct)}
                    </div>
                    <div class="order-control">
                        <div class="total">Tổng thanh toán:  <span class="text-total">${order.total.toLocaleString('da-DK')} VNĐ</span></div>
                        ${order.isCancel?`
                        <div class="btn control-check-out__btn bg-warning btn-re-order" data-id="${order._id}">
                            Đặt hàng lại
                        </div>`
                        :order.isCheck?'':
                        `<div class="order-control__btn" data-id="${order._id}">
                            Hủy đơn
                        </div>`}
                    </div>
                </div>
            </div>
        `
        }
    }

    function countProduct(data=null) {
        let countCheck = 0;
        let countCancel = 0;
        let countShipping = 0;
        let countDone = 0;
        if (data) {
            data.map(e=> {
                if (e.isCheck && !e.isShipping) {
                    countCheck++
                } else if (e.isShipping && !e.isDone) {
                    countShipping++
                } else if (e.isDone) {
                    countDone++
                } else if (e.isCancel) {
                    countCancel++
                }
                $('.num-order.all').html(data.length);
                $('.num-order.check').html(countCheck);
                $('.num-order.shipping').html(countShipping);
                $('.num-order.done').html(countDone);
                $('.num-order.cancel').html(countCancel);
            })
        }
    }
})()