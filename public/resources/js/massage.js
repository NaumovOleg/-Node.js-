function testimoni() {
    fetch('/refreshMassages', {
            headers: {
                "Content-type": "text/html; charset=UTF-8"
            },
            method: 'post',
            body: 'ttt'
        }
    ).then(function (response) {
            return response.json();
        })
        .then(function (response) {
            alert(response[0].testimonial);
//
            var Testimonial = {
                'id': response[0].id,
                'user_id': response[0].user_id,
                'date': response[0].date,
                'testimonial': response[0].testimonial
            };
            alert(Testimonial.testimonial + "  " + Testimonial.date);

            for (var q = 0; q < response.length; q++) {
//                        Testimonial=
//                      alert(response[q].testimonial) ;
            }
        })
        .catch(alert);

//        massagesDiv.innerHTML = "";

}