socket.on('checkout-order', ()=> {
    spawnNotification('Đã có đơn hàng mới được đặt', '/img/logo.png', 'ĐƠN HÀNG MỚI!');
})

socket.on('cancel-order', ()=>{
    spawnNotification('Đã có đơn hàng bị hủy', '/img/logo.png', 'THÔNG BÁO!');
})

function spawnNotification(body, icon, title) {
    var options = {
        body: body,
        icon: icon
    }
    var notification = new Notification(title, options);
  }