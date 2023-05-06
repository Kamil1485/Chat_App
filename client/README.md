socket.on("message",(data)=>{
    clg(data)
})
//on metodu istek geldiğinde yapılacak işlem message on metodu karşılama işlemi
//emmit ile gönderilir veri on ile serverde dinlenir alınır
react 18+ sürümde index.js React.strictMode kaldır  ilk gönderilen isteği geçersiz sayıyor ikinci isteği geçerli saydığı için 2  cevap döndürüyor