$(function() {
  var $orders = $('#orders');
  var today = new Date();
  var months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var val = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear();
  $("#printDate").text(val + " " + time);
  $("#searchInput").keyup(function(event) {
    if (event.keyCode === 13) {
      $("#searchBtn").click();
    }
  });
  $.ajax({
    url: 'https://api.covidindiatracker.com/state_data.json',
    complete: function(response) {
      var jsonArray = JSON.parse(response.responseText);
      const DEFAULT_STATE = "Madhya Pradesh"
      $(jsonArray).each(function(index, item) {
        if (item.state == DEFAULT_STATE) {
          $(item.districtData).each(function(index, data) {});
          $('#stateName').html(item.state);
          $('#stateConfirm').html(item.confirmed);
          $('#stateActive').html(item.active);
          $('#stateRecover').html(item.recovered);
          $('#stateDeath').html(item.deaths);
        }
      });
    },
    error: function() {
      $('#output').html('There was an error!');
    },
  });
  $.getJSON("https://api.covidindiatracker.com/state_data.json", function(data) {
    var state_data = '';
    var availableTags = [];
    $.each(data, function(key, value) {
      availableTags.push(value.state);
      state_data += '<tr>';
      state_data += '<td>' + value.state + '</td>';
      state_data += '<td>' + value.active + '</td>';
      state_data += '<td>' + value.confirmed + '</td>';
      state_data += '<td>' + value.recovered + '</td>';
      state_data += '<td>' + value.deaths + '</td>';
      state_data += '<tr>';
    });
    $("#searchInput").autocomplete({
      source: availableTags
    });
    $('#state_table').append(state_data);
  });
  $.ajax({
    url: 'http://covid19-india-adhikansh.herokuapp.com/summary',
    contentType: 'application/json',
    complete: function(response) {
      console.log(response);
      var activeObj = response.responseText;
      var objectTotal = JSON.parse(activeObj);
      $('#confirmCases').html(objectTotal['Total Cases']);
      $('#activeCases').html(objectTotal['Active cases']);
      $('#recovered').html(objectTotal['Cured/Discharged/Migrated']);
      $('#death').html(objectTotal['Death']);
    },
  });
  $.ajax({
    url: 'https://api.covid19india.org/data.json',
    complete: function(response) {
      var jsonArray = JSON.parse(response.responseText);
      $(jsonArray).each(function(index, item) {
        $(item.tested).each(function(index, data) {
          if (data.updatetimestamp == "20/06/2020 09:00:00") {
            $('#tested').html(data.totalsamplestested);
          }
        });
      });
    },
  });


  

  var ctx_live = document.getElementById("mycanvas");
  var myChart = new Chart(ctx_live, {
    type: 'bar',
   
    data: {
      labels: [],
      datasets: [{
        data: [],
        backgroundColor : '#FF0000',
        borderradius: '4px',
        label: 'liveCount',
      }]
    },
    options: {
      responsive: true,
      title: {
        display: true,
      },
      legend: {
        display: false
      },
      scales: {

         xAxes: [{
      gridLines: {
         display: false
      }
      
   }],
        yAxes: [{
          display: false,
          ticks: {
            beginAtZero: true,
              callback: function() {
                        return "";
                    }
          },
          
           gridLines: {
         display: false
      }
        }]
      }
    }
  });



  
  $(function() {
    $.ajax({
      url: 'https://api.covid19india.org/data.json',
      complete: function(response) {
        var jsonArray = JSON.parse(response.responseText);
        $(jsonArray).each(function(index, item) {
          for (var i = 1; i <= 5; i++) {
            var today = new Date();
            var countDate = today.getDate() - i;
            var monthIndex = today.getMonth();
            var monthName = months[monthIndex];
            var dateCount = countDate + " " + monthName + " ";
            $(item.cases_time_series).each(function(index, data) {
              if (data.date == dateCount) {
                myChart.data.labels.push(data.date);
                myChart.data.datasets[0].data.push(data.dailydeceased);
              }
              myChart.update();
            });
          }
        });
      },
    });
  });

$("#searchBtn").click(function() {
  var stateName = $("#searchInput").val();
  var x, i = "";
  $.ajax({
    url: 'http://covid19-india-adhikansh.herokuapp.com/state/' + stateName,
    complete: function(response) {
      var myObj = response.responseText;
      var obj = JSON.parse(myObj);
      for (i in obj.data) {
        $('#stateName').html(obj.data[i].name);
        $('#stateConfirm').html(obj.data[i].total);
        $('#stateActive').html(obj.data[i].active);
        $('#stateRecover').html(obj.data[i].cured);
        $('#stateDeath').html(obj.data[i].death);
      }
    },
    error: function() {
      $('#output').html('There was an error!');
    },
  });
});
});