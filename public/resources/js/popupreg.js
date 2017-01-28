$(document).ready(function() { // ��� �a��� �o��� �a������ ���a����
	$('a#go').click( function(event){ // �o��� ���� �o ������ � id="go"
		event.preventDefault(); // ������a�� ��a��a����� �o�� �������a
		$('#overlay').fadeIn(400, // ��a�a�a ��a��o �o�a���a�� ������ �o��o���
		 	function(){ // �o��� ���o������ ����������� a���a���
				$('#modal_form') 
					.css('display', 'block') // ����a�� � �o�a���o�o o��a display: none;
					.animate({opacity: 1, top: '35%'}, 200); // ��a��o ����a����� ��o��a��o��� o��o�������o �o �����a���� ����
		});
	});
	/* �a������ �o�a���o�o o��a, ��� ���a�� �o �� �a�o� �o � o��a��o� �o����� */
	$('#modal_close, #overlay').click( function(){ // �o��� ���� �o �������� ��� �o��o���
		$('#modal_form')
			.animate({opacity: 0, top: '45%'}, 200,  // ��a��o ������ ��o��a��o��� �a 0 � o��o�������o ����a�� o��o �����
				function(){ // �o��� a���a���
					$(this).css('display', 'none'); // ���a�� ��� display: none;
					$('#overlay').fadeOut(400); // �����a�� �o��o���
				}
			);
	});
});

$(document).ready(function() { // ��� �a��� �o��� �a������ ���a����
    $('a#go_login').click( function(event){ // �o��� ���� �o ������ � id="go"
        event.preventDefault(); // ������a�� ��a��a����� �o�� �������a
        $('#overlay_login').fadeIn(400, // ��a�a�a ��a��o �o�a���a�� ������ �o��o���
            function(){ // �o��� ���o������ ����������� a���a���
                $('#modal_form_login')
                    .css('display', 'block') // ����a�� � �o�a���o�o o��a display: none;
                    .animate({opacity: 1, top: '35%'}, 200); // ��a��o ����a����� ��o��a��o��� o��o�������o �o �����a���� ����
            });
    });
    /* �a������ �o�a���o�o o��a, ��� ���a�� �o �� �a�o� �o � o��a��o� �o����� */
    $('#modal_close_login, #modal_close_login2, #modal_close_login3, #overlay_login').click( function(){ // �o��� ���� �o �������� ��� �o��o���
        $('#modal_form_login')
            .animate({opacity: 0, top: '45%'}, 200,  // ��a��o ������ ��o��a��o��� �a 0 � o��o�������o ����a�� o��o �����
                function(){ // �o��� a���a���
                    $(this).css('display', 'none'); // ���a�� ��� display: none;
                    $('#overlay_login').fadeOut(400); // �����a�� �o��o���
                }
            );
    });
});

$(document).ready(function() { // ��� �a��� �o��� �a������ ���a����
    $('a#go_profile').click( function(event){ // �o��� ���� �o ������ � id="go"
        event.preventDefault(); // ������a�� ��a��a����� �o�� �������a
        $('#overlay_profile').fadeIn(400, // ��a�a�a ��a��o �o�a���a�� ������ �o��o���
            function(){ // �o��� ���o������ ����������� a���a���
                $('#modal_form_profile')
                    .css('display', 'block') // ����a�� � �o�a���o�o o��a display: none;
                    .animate({opacity: 1, top: '35%'}, 200); // ��a��o ����a����� ��o��a��o��� o��o�������o �o �����a���� ����
            });
    });
    /* �a������ �o�a���o�o o��a, ��� ���a�� �o �� �a�o� �o � o��a��o� �o����� */
    $('#modal_close_profile, #modal_close_profile2, #modal_close_profile3, #profile_window_close, #overlay_profile').click( function(){ // �o��� ���� �o �������� ��� �o��o���
        $('#modal_form_profile')
            .animate({opacity: 0, top: '45%'}, 200,  // ��a��o ������ ��o��a��o��� �a 0 � o��o�������o ����a�� o��o �����
                function(){ // �o��� a���a���
                    $(this).css('display', 'none'); // ���a�� ��� display: none;
                    $('#overlay_profile').fadeOut(400); // �����a�� �o��o���
                }
            );
    });
});

$(document).ready(function() { // ��� �a��� �o��� �a������ ���a����
    $('a#go_edit_profile').click( function(event){ // �o��� ���� �o ������ � id="go"
        event.preventDefault(); // ������a�� ��a��a����� �o�� �������a
        $('#overlay_edit_profile').fadeIn(400, // ��a�a�a ��a��o �o�a���a�� ������ �o��o���
            function(){ // �o��� ���o������ ����������� a���a���
                $('#modal_form_edit_profile')
                    .css('display', 'block') // ����a�� � �o�a���o�o o��a display: none;
                    .animate({opacity: 1, top: '35%'}, 200); // ��a��o ����a����� ��o��a��o��� o��o�������o �o �����a���� ����
            });
    });
    /* �a������ �o�a���o�o o��a, ��� ���a�� �o �� �a�o� �o � o��a��o� �o����� */
    $('#modal_close_edit_profile, #modal_close_edit_profile2, #edit_profile_window_close, #overlay_edit_profile').click( function(){ // �o��� ���� �o �������� ��� �o��o���
        $('#modal_form_edit_profile')
            .animate({opacity: 0, top: '45%'}, 200,  // ��a��o ������ ��o��a��o��� �a 0 � o��o�������o ����a�� o��o �����
                function(){ // �o��� a���a���
                    $(this).css('display', 'none'); // ���a�� ��� display: none;
                    $('#overlay_edit_profile').fadeOut(400); // �����a�� �o��o���
                }
            );
    });
});

$(document).ready(function() { // ��� �a��� �o��� �a������ ���a����
    $('a#go_rules').click( function(event){ // �o��� ���� �o ������ � id="go"
        event.preventDefault(); // ������a�� ��a��a����� �o�� �������a
        $('#overlay_rules').fadeIn(400, // ��a�a�a ��a��o �o�a���a�� ������ �o��o���
            function(){ // �o��� ���o������ ����������� a���a���
                $('#modal_form_rules')
                    .css('display', 'block') // ����a�� � �o�a���o�o o��a display: none;
                    .animate({opacity: 1, top: '35%'}, 200); // ��a��o ����a����� ��o��a��o��� o��o�������o �o �����a���� ����
            });
    });
    /* �a������ �o�a���o�o o��a, ��� ���a�� �o �� �a�o� �o � o��a��o� �o����� */
    $('#modal_close_rules, #modal_close_rules2, #rules_window_close, #overlay_rules').click( function(){ // �o��� ���� �o �������� ��� �o��o���
        $('#modal_form_rules')
            .animate({opacity: 0, top: '45%'}, 200,  // ��a��o ������ ��o��a��o��� �a 0 � o��o�������o ����a�� o��o �����
                function(){ // �o��� a���a���
                    $(this).css('display', 'none'); // ���a�� ��� display: none;
                    $('#overlay_rules').fadeOut(400); // �����a�� �o��o���
                }
            );
    });
});