const container = document.querySelector(".container");
const count = document.querySelector('#count');
const amount =document.querySelector('#amount');
const filmİnfo = document.querySelector('#movie');
const buy = document.querySelector('.odeme');
const seats = document.querySelectorAll(".seat");



getFromLocalStorage();
getFromLocalStorage2();
calculate();


//"e.target" ifadesi, olayın gerçekleştiği DOM elemanını temsil eder. Yani, tıklama olayı hangi elemana uygulandıysa, bu ifade o elemanı temsil eder. 
container.addEventListener('click',function(e){
    if(e.target.classList.contains('seat') &&  !e.target.classList.contains('reserved')){  //ilk ifade seat classına sahip olanları yazdırıyor sadece. ikinci ise daha önceden dolu olan koltuklara tıklamayı önlüyo
        e.target.classList.toggle('selected'); //toggle = içinde o class varsa siler yoksa ekler
        calculate();

    }
});

filmİnfo.addEventListener('change',function(e){ //change: film secimi değişince value bilgileri de değiştirir
    calculate();
})


buy.addEventListener('click',function(){
    const element = document.querySelectorAll('.seat.selected');
    element.forEach(element => {
        if(element.id!='select'){
            element.classList.remove('selected');
            element.classList.add('reserved');
            calculate();
        }
        
    });
    
})

//local storage tarayıcının sunduğu bir API'dir ve web sayfasının verilerini kullanıcının tarayıcısında saklamak için kullanılır.
// Bu şekilde, sayfa yenilense bile veriler korunur ve erişilebilir kalır.
//her koltuğun index numarasını bulup bunu local storage ile saklicaaz

function calculate(){
    const selectedSeats = container.querySelectorAll('.seat.selected');
    const reservedSeats = container.querySelectorAll('.seat.reserved');
    const selectedSeatsArr = []; // selected ların olduğu boş bir dizi tanımla
    const reservedSeatsArr = []; // reserved larn olduğu dizi tanımla
    const seatsArr = []; // hepsinin olduğu diziyi tanımla;js de map metodu nasıl çalışır


    selectedSeats.forEach(function(seat){ // selected olan elemanları tek tek dönüp dizi içine her bir eleman push edilir
        selectedSeatsArr.push(seat)
    });

    reservedSeats.forEach(function(seat){ // reserved olan elemanları tek tek dönüp dizi içine her bir eleman push edilir
        reservedSeatsArr.push(seat)
    });


    seats.forEach(function(seat){ // seat olan elemanları tek tek dönüp dizi içine her bir eleman push edilir
        seatsArr.push(seat)
    });



    // map metodu: seçtiğimiz dizinin içindeki elemanları söylediğimiz işlemi yaptıktan sonra yeni bir diziye kopyalamaya yarar
    //asağıda selected claasına sahip olan elemanların bulunduğu dizimizda map metodu kullandık
    // bu elemanların index numaraları tüm koltukların olduğu diziden bulunup selectedSeatIndexs içine index numaraları yazdırılır.
    //indexof: seatsArr içinden (seat) lerin index numarasını nulmamızı sağlar

    const selectedSeatsIndexs = selectedSeatsArr.map(function(seat){
        return seatsArr.indexOf(seat);
    });
    
    // yukarıdakinin aynısını reserved class ına sahip olanlara da yaptık
    const reservedSeatsIndexs = reservedSeatsArr.map(function(seat){
        return seatsArr.indexOf(seat);
    });
 
    let selectedSeatCount= selectedSeats.length;
    count.innerText = selectedSeatCount;
    amount.innerText = selectedSeatCount*filmİnfo.value;

    //local storage e kaydetmek için oluşturduğumuz fonksiyona gönderiyoruz

    saveToLocalStorage(selectedSeatsIndexs);
    saveToLocalStorage2(reservedSeatsIndexs);
    
    
}

//bu fonksiyonlar local storage içinde saklamamıza yardımcı olur
// setitem: seçilen koltukları local storgae ye kaydeder
//iki parametre alır. key ve value. key bilgisi üzerinden kaydedilen bilgiye ulaşılır. 
// JSon.stringift(): bu metod js nesnesini JSON biçimine dönüştürür bu şekilde veri kaydedilir 


function saveToLocalStorage(indexs){
    
    localStorage.setItem('selectedSeats', JSON.stringify(indexs));
    localStorage.setItem('selectedMovieIndex', filmİnfo.selectedIndex);
}

function saveToLocalStorage2(indexs){
    
    localStorage.setItem('reservedSeats', JSON.stringify(indexs));
    localStorage.setItem('reservedMovieIndex', filmİnfo.selectedIndex);

}


// burada kaydettiğimiz bilgileri alma işlemi yapıyoruz. 
//localStorage.getItem('selectedSeats'): burada selectedSeats anahtarına sahip değeri local storage den alır
//Json.parse() metodu json ile yazılan veriyi javascript nesnesine dönüştürür
function getFromLocalStorage(){

    const selectedSeats = JSON.parse(localStorage.getItem('selectedSeats')); //selectedSeats değişkeni selectedSeats key ine ilişkin veriyi içerir 

    if(selectedSeats != null && selectedSeats.length > 0){ //selectedseats içinde bilgi var mı diye kontrol ediyoruz

        seats.forEach(function(seat, index){ //tüm koltukları dolşıyoruz. dolaştığımız koltuklar seat index numaraları index olacak

            if(selectedSeats.indexOf(index) > -1){//selectedseat içinde 'index'(dolaşılan koltuğun index numarasıdır) numarası olup olmadığını kontrol eder
                seat.classList.add('selected');//eğer index numarası varsa ilgili koltuğa selected classı eklenir
            }

        })
    }


    const selectedMovieIndex = JSON.parse(localStorage.getItem('selectedMovieIndex'));


    if(selectedMovieIndex!= null){ //movie daha önceden seçilmişse bu işlem yapılır
        filmİnfo.selectedIndex = selectedMovieIndex; //daha önceden seçilen movie nin index i filmInfo nun index numarasına verilir.
        //böylelikle kullanıcı sayfayı güncellediğinde daha önce hangi movie i seçtiyse ekranda gene o olur
    }
}


function getFromLocalStorage2(){
    const reservedSeats = JSON.parse(localStorage.getItem('reservedSeats'));

    if(reservedSeats != null && reservedSeats.length > 0){

        seats.forEach(function(seat, index){
            if(reservedSeats.indexOf(index)>-1){
                seat.classList.add('reserved');
            }
        })
    }

    const reservedMovieIndex = JSON.parse(localStorage.getItem('reservedMovieIndex'));
    
    if(reservedMovieIndex != null){
        filmİnfo.selectedIndex = reservedMovieIndex;
    }
}