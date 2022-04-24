function drawLine(ctx, startX, startY, endX, endY){
    ctx.beginPath();
    ctx.moveTo(startX,startY);
    ctx.lineTo(endX,endY);
    ctx.stroke();
}

function drawArc(ctx, centerX, centerY, radius, startAngle, endAngle){
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.stroke();
}


function drawPieSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color ){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX,centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fill();
}


function drawSquare(ctx, centerX, centerY, size, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(centerX - size/2, centerY + size/2);
    ctx.lineTo(centerX + size/2, centerY + size/2);
    ctx.lineTo(centerX + size/2, centerY - size/2);
    ctx.lineTo(centerX - size/2, centerY - size/2);
    ctx.fill();
}


function drawRectangle(ctx, startX, startY, sizeX, sizeY, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX, startY - sizeY);
    ctx.lineTo(startX + sizeX, startY - sizeY);
    ctx.lineTo(startX + sizeX, startY);
    ctx.fill()
}


function getContextValue(name) {
    return Number(document.getElementById(name).innerHTML);}


var Piechart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.colors = options.colors;

    this.draw = function(){
        var total_value = 0;
        var color_index = 0;
        for (var categ in this.options.data){
            var val = this.options.data[categ];
            total_value += val;
        }

        var start_angle = 0;
        for (categ in this.options.data){
            val = this.options.data[categ];
            var slice_angle = 2 * Math.PI * val / total_value;

            drawPieSlice(
                this.ctx,
                this.canvas.width/2,
                this.canvas.height/2,
                Math.min(this.canvas.width/2,this.canvas.height/2),
                start_angle,
                start_angle+slice_angle,
                this.colors[color_index%this.colors.length]
            );

            start_angle += slice_angle;
            color_index++;
        }
        if (this.options.legend){
                color_index = 0;
                var legendHTML = "";
                for (categ in this.options.data){
                    legendHTML += "<div class='legend1_cont'><span class='legend' style='display:inline-block;background-color:"+this.colors[color_index++]+";'>&nbsp;</span> "+categ+"</div>";
                }
                this.options.legend.innerHTML = legendHTML;
		}
		if (this.options.doughnut){
		    this.ctx.globalCompositeOperation = 'destination-out';
		    drawPieSlice(
				this.ctx,
				this.canvas.width/2,
				this.canvas.height/2,
				this.options.doughnut * Math.min(this.canvas.width/2,this.canvas.height/2),
				0,
				2 * Math.PI,
				"#ff0000"
			);

		}

    }
}


var Barchart = function(options){
    this.options = options;
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.color = options.color;
    this.data = options.data;
    this.max_value = options.max_value;
    this.rect_width = options.rect_width;
    this.rect_height = options.rect_height;
    this.values_count = options.values_count;
    this.space_width = options.space_width;
    this.rect_count = Object.keys(this.data).length;
    this.left_border = options.left_border;
    this.bottom_border = options.bottom_border;



    this.draw = function(){
        var numb = 0;

        for (let i = this.values_count; i >= 0; i--) {
            drawRectangle(this.ctx, this.left_border, this.canvas.height - (-2 + this.rect_height / this.values_count * i) - this.bottom_border, this.canvas.width, 2, '#777777');

            var labelText = i;
			this.ctx.fillStyle = "#000000";
			this.ctx.font = "15px Arial";
			this.ctx.fillText(labelText, this.left_border - 15, this.canvas.height - (-2 + this.rect_height / this.values_count * i) - this.bottom_border);
        }

        for (categ in this.data){
            val = this.options.data[categ];
            drawRectangle(this.ctx, this.left_border * 1.5 + (this.space_width + this.rect_width) * numb, this.canvas.height - this.bottom_border,
                          this.rect_width, this.rect_height / this.values_count * val, this.color);
            var labelText1 = ['Головная', 'Упадок', 'Снижение', 'Трудности с', 'Раздражи-', 'Сильная'][categ - 1];
            var labelText2 = ['боль', 'сил', 'настроения', 'вниманием', 'тельность', 'сонливость'][categ - 1];
            this.ctx.fillStyle = "#000000";
			this.ctx.font = "15px Arial";
			this.ctx.fillText(labelText1, this.left_border * 1.5 + (this.space_width + this.rect_width) * numb, this.canvas.height - this.bottom_border + 20);
			this.ctx.fillText(labelText2, this.left_border * 1.5 + (this.space_width + this.rect_width) * numb, this.canvas.height - this.bottom_border + 35);


            numb++;
        }
        drawRectangle(this.ctx, this.left_border, this.canvas.height - this.bottom_border, this.canvas.width, 3, '#000000');
        drawRectangle(this.ctx, this.left_border, this.canvas.height - this.bottom_border, 3, this.canvas.height, '#000000');


    }

}


var genderData = {'Мужчины': getContextValue('male'), 'Женщины': getContextValue('female')};
var jobData = {'Школники': getContextValue('Sc'), 'Студенты': getContextValue('St'),
 'Преподаватели': getContextValue('T'), 'Другие': getContextValue('O')};
var symptomsData = {1: getContextValue('symp1'), 2: getContextValue('symp2'), 3: getContextValue('symp3'),
                    4: getContextValue('symp4'), 5: getContextValue('symp5'), 6: getContextValue('symp6')};
var ageData = {'15-': getContextValue('age15-'), '16-18': getContextValue('age16-18'), '19-23': getContextValue('age19-23'),
 '24-30': getContextValue('age24-30'), '31-45': getContextValue('age31-45'), '46-60': getContextValue('age46-60'), '61+': getContextValue('age61+')};
var caffe1Data = {'Почти никогда': getContextValue('caffe1_0'), 'Единожды в месяц или реже': getContextValue('caffe1_1'), 'Несколько раз в месяц': getContextValue('caffe1_2'), '2-3 раза в неделю': getContextValue('caffe1_3'), 'Ежедневно': getContextValue('caffe1_4'), 'Несколько раз в день': getContextValue('caffe1_5')};
var caffe2Data = {'Почти никогда': getContextValue('caffe2_0'), 'Единожды в месяц или реже': getContextValue('caffe2_1'), 'Несколько раз в месяц': getContextValue('caffe2_2'), '2-3 раза в неделю': getContextValue('caffe2_3'), 'Ежедневно': getContextValue('caffe2_4'), 'Несколько раз в день': getContextValue('caffe2_5')};
var teaData = {'Почти никогда': getContextValue('tea_0'), 'Единожды в месяц или реже': getContextValue('tea_1'), 'Несколько раз в месяц': getContextValue('tea_2'), '2-3 раза в неделю': getContextValue('tea_3'), 'Ежедневно': getContextValue('tea_4'), 'Несколько раз в день': getContextValue('tea_5')};
var energydrinksData = {'Почти никогда': getContextValue('energydrinks_0'), 'Единожды в месяц или реже': getContextValue('energydrinks_1'), 'Несколько раз в месяц': getContextValue('energydrinks_2'), '2-3 раза в неделю': getContextValue('energydrinks_3'), 'Ежедневно': getContextValue('energydrinks_4'), 'Несколько раз в день': getContextValue('energydrinks_5')};
var pillsData = {'Почти никогда': getContextValue('pills_0'), 'Единожды в месяц или реже': getContextValue('pills_1'), 'Несколько раз в месяц': getContextValue('pills_2'), '2-3 раза в неделю': getContextValue('pills_3'), 'Ежедневно': getContextValue('pills_4'), 'Несколько раз в день': getContextValue('pills_5')};
var spec1Data = {'Никогда': getContextValue('spec1_0'), 'Иногда': getContextValue('spec1_1'), 'Часто': getContextValue('spec1_2'), 'Каждый день': getContextValue('spec1_3')};
var spec2Data = {'Никогда': getContextValue('spec2_0'), 'Иногда': getContextValue('spec2_1'), 'Часто': getContextValue('spec2_2'), 'Каждый день': getContextValue('spec2_3')};
var spec3Data = {'Нет': getContextValue('spec3_0'), 'В некоторой степени': getContextValue('spec3_1'), 'Да': getContextValue('spec3_2')};

var myCanvas = 0;
var ctx = 0;
var myPiechart = 0;
var myLegend = 0;


function create_piechart(canvas_name, canvas_data, canvas_colors, canvas_legend, doughnut = 0){
    myCanvas = document.getElementById(canvas_name);
    myCanvas.width = 300;
    myCanvas.height = 250;
    ctx = myCanvas.getContext('2d');
    myLegend = document.getElementById(canvas_legend);

    myPiechart = new Piechart(
    {
        canvas:myCanvas,
        data:canvas_data,
        colors: canvas_colors,
        legend: myLegend,
        doughnut: doughnut
    });
    myPiechart.draw();
}

function create_barchart(canvas_name, canvas_data, color, max_value, rect_width, rect_height, values_count, space_width, left_border, bottom_border){
    myCanvas = document.getElementById(canvas_name);
    myCanvas.width = 600;
    myCanvas.height = 600;
    ctx = myCanvas.getContext('2d');

    myBarchart = new Barchart(
    {
        canvas:myCanvas,
        data: canvas_data,
        color: color,
        max_value: max_value,
        rect_width: rect_width,
        rect_height: rect_height,
        values_count: values_count,
        space_width: space_width,
        left_border: left_border,
        bottom_border: bottom_border
    });
    myBarchart.draw();
}

create_piechart('genderCanvas', genderData, ["#9900FF", "#330066", "#CC99FF", "#663399"], 'genderLegend', 0.5);
create_piechart('jobCanvas', jobData, ["#9900CC","#330033", "#663366", "#9900FF"], 'jobLegend', 0.5);
create_piechart('ageCanvas', ageData, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'ageLegend', 0.5);
create_piechart('caffe1Canvas', caffe1Data, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'caffe1Legend', 0.5);
create_piechart('caffe2Canvas', caffe2Data, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'caffe2Legend', 0.5);
create_piechart('teaCanvas', teaData, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'teaLegend', 0.5);
create_piechart('energydrinksCanvas', energydrinksData, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'energydrinksLegend', 0.5);
create_piechart('pillsCanvas', pillsData, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'pillsLegend', 0.5);
create_piechart('spec1Canvas', spec1Data, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'spec1Legend', 0.5);
create_piechart('spec2Canvas', spec2Data, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'spec2Legend', 0.5);
create_piechart('spec3Canvas', spec3Data, ["#9900FF","#663399", "#330066", "#CC99FF", "#9900CC", "#663366", "#330033", "#CC99FF"], 'spec3Legend', 0.5);
create_barchart('barCanvas', symptomsData, '#9900FF', 6, 50, 550, 6, 40, 35, 40);

function myFunction() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}
