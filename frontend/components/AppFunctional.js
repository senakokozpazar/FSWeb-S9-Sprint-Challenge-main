import axios from 'axios'
import React, { useState } from 'react'

// önerilen başlangıç stateleri
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  // AŞAĞIDAKİ HELPERLAR SADECE ÖNERİDİR.
  // Bunları silip kendi mantığınızla sıfırdan geliştirebilirsiniz.
  const [mesaj, setMesaj] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);

  function getXY() {
    // Koordinatları izlemek için bir state e sahip olmak gerekli değildir.
    // Bunları hesaplayabilmek için "B" nin hangi indexte olduğunu bilmek yeterlidir.
    // i= x+width*y => 2D den 1D ye dönüşüm
    // x = i%width; y = i/width => 1D den 2D ye dönüşüm
    /*  (1, 1) (2, 1) (3, 1)
        (1, 2) (2, 2) (3, 2)
        (1, 3) (2, 3) (3, 3) */

    return [(index%3)+1, Math.floor(index/3)+1] //koordinatlar 1 e 1 den başlıyor
   
  }

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    return `Koordinatlar (${getXY()[0]}, ${getXY()[1]})`;
   
  }

  function reset() {
    // Tüm stateleri başlangıç ​​değerlerine sıfırlamak için bu helperı kullanın.
    setMesaj(initialMessage);
    setEmail(initialEmail);
    setSteps(initialSteps);
    setIndex(initialIndex)
  }


  function sonrakiIndex(yon) {
    // Bu helper bir yön ("sol", "yukarı", vb.) alır ve "B" nin bir sonraki indeksinin ne olduğunu hesaplar.
    // Gridin kenarına ulaşıldığında başka gidecek yer olmadığı için,
    // şu anki indeksi değiştirmemeli.
    const [x, y] = getXY();
    if(yon === "left" && x > 1){
     return index - 1;
    };
    if(yon === "right" && x < 3){
      return index + 1;
    };
    if(yon === "up" && y > 1){
      return index - 3;
    };
    if(yon === "down" && y < 3){
      return index + 3;
    };
    return index;
  } 

  function ilerle(evt) {
    // Bu event handler, "B" için yeni bir dizin elde etmek üzere yukarıdaki yardımcıyı kullanabilir,
    // ve buna göre state i değiştirir.
    const yon = evt.target.id;

    const newIndex = sonrakiIndex(yon);

    if (newIndex !== index) {
      setIndex(newIndex);
      setSteps(steps + 1);
      setMesaj("");
    } else 
      {if (yon === 'left') {
      setMesaj("Sola gidemezsiniz");
    } else if (yon === 'right') {
      setMesaj("Sağa gidemezsiniz");
    } else if (yon === 'up') {
      setMesaj("Yukarıya gidemezsiniz");
    } else if (yon === 'down') {
      setMesaj("Aşağıya gidemezsiniz");
    }
    }
    
  }

  function onChange(evt) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(evt.target.value);
  }

  function onSubmitHandler(evt) {
    evt.preventDefault();
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    
    axios
      .post("http://localhost:9000/api/result", {
        x: getXY()[0],
        y: getXY()[1],
        steps: steps,
        email: email,
      })
      .then(function (response) {
        console.log(response);
        setMesaj(response.data.message);
      })
      .catch(function (error) {
        console.log(error);
        setMesaj(error.response.data.message);
      });
  
    setEmail(initialEmail);
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMesaj()}</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{mesaj}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={ilerle}>SOL</button>
        <button id="up" onClick={ilerle}>YUKARI</button>
        <button id="right" onClick={ilerle}>SAĞ</button>
        <button id="down" onClick={ilerle}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmitHandler}>
        <input id="email" type="email" placeholder="email girin" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
