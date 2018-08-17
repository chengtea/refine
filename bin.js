function run()
{
	var prop=parseFloat(document.getElementById("prop").value)/100,
	    total=parseInt(document.getElementById("total").value,10),
	    brif=document.getElementById("brif"),
	    tb=document.getElementById("tb"),
	    i,tr,td;
	
	//計算
	var arr=new Float64Array(total+1);
	for(i=0;i<=total;++i)
	{
		arr[i]=binomdist(i,total,prop);
	}
	var itvl95=getInteval(arr,0.05,total),
	    itvl99=getInteval(arr,0.01,total),
	    itvl70=getInteval(arr,0.3,total);
	//
	brif.innerHTML="<p title='100個人中大約有70個人的成功次數會落在此區間'><span class='in70'>　</span> 70區間："+itvl70.join("~")+"</p>"
	    +"<p title='100個人中大約有95個人的成功次數會落在此區間'><span class='in95'>　</span> 95區間："+itvl95.join("~")+"</p>"
	    +"<p title='100個人中大約有99個人的成功次數會落在此區間'><span class='in99'>　</span> 99區間："+itvl99.join("~")+"</p>"
	    +"<p title='100個人中大約不到1個人的成功次數會落在此區間'><span class='out99'>　</span> 99區間之外</p>"
	    +"表格機率為四捨五入，小於 0.005% 不顯示";
	
	//輸出表格
	tb.innerHTML="";
	tb.appendChild(tr=document.createElement("tr"));
	tr.appendChild(td=document.createElement("th"));
	td.textContent="成功次數";
	tr.appendChild(td=document.createElement("th"));
	td.textContent="可能性(%)";
	for(i=0;i<=total;++i)
	{
		if(arr[i]<0.00005)
			continue;
		tb.appendChild(tr=document.createElement("tr"));
		if(itvl70[0]<=i && i<=itvl70[1])
			tr.setAttribute("class","in70");
		else if(itvl95[0]<=i && i<=itvl95[1])
			tr.setAttribute("class","in95");
		else if(itvl99[0]<=i && i<=itvl99[1])
			tr.setAttribute("class","in99");
		else
			tr.setAttribute("class","out99");
		tr.appendChild(td=document.createElement("td"));
		td.textContent=i;
		tr.appendChild(td=document.createElement("td"));
		td.textContent=(arr[i]*100).toFixed(2);
	}
}
function binomdist(X,T,P)
{
	var n=X*2<T?X:T-X,
	    p1=P,
	    p2=1-P,
	    n1=X,
	    n2=T-X,
	    r=1;
	//計算 C(T,n)*p1^n1*p2^n2
	for(;n>0;--n)
	{
		r*=(T-n+1)/n;
		for(;r>1 && n1>0;--n1)
			r*=p1;
		for(;r>1 && n2>0;--n2)
			r*=p2;
	}
	return r*Math.pow(p1,n1)*Math.pow(p2,n2);
}
function getInteval(arr,a,total)
{
	var sum=0,
	    iL=0,
	    iR=total,
	    vL,vR;
	while(iL<iR)
	{
		vL=arr[iL];
		vR=arr[iR];
		if(vL<vR)
		{
			if(sum+vL>=a)
				break;
			sum+=vL;
			++iL;
		} else if (vL>vR) {
			if(sum+vR>=a)
				break;
			sum+=vR;
			--iR;
		} else {
			if(sum+vL+vR>=a)
				break;
			sum+=vR+vL;
			++iL;
			--iR;
		}
	}
	return [iL,iR];
}
function run2()
{
	var tb=document.getElementById("tb"),
	    test=[10,15,20,25,30,40,50,75,100,150,200],
	    i,j,k,itvl,prop,arr=new Float64Array(201),tr,td,th;
	tb.innerHTML="";
	
	tb.appendChild(tr=document.createElement("tr"));
	tr.appendChild(td=document.createElement("th"));
	td.setAttribute("colspan","2");
	td.setAttribute("rowspan","2");
	td.innerHTML="99%玩家<br>成功次數";
	tr.appendChild(td=document.createElement("th"));
	td.setAttribute("colspan",test.length);
	td.textContent="精煉數量";
	tb.appendChild(tr=document.createElement("tr"));
	for(j=0;j<test.length;++j)
	{
		tr.appendChild(td=document.createElement("th"));
		td.textContent=test[j];
	}
	for(i=5;i<100;i+=5)
	{
		prop=i/100;
		tb.appendChild(tr=document.createElement("tr"));
		if(i==5)
		{
			tr.appendChild(td=document.createElement("th"));
			td.setAttribute("rowspan","19");
			td.innerHTML="公<br>告<br>機<br>率<br>(%)";
		}
		tr.appendChild(td=document.createElement("th"));
		td.textContent=i;
		for(j=0;j<test.length;++j)
		{
			total=test[j];
			for(k=0;k<=total;++k)
				arr[k]=binomdist(k,total,prop);
			itvl=getInteval(arr,0.01,total);
			tr.appendChild(td=document.createElement("td"));
			td.setAttribute("class","cen")
			td.textContent=itvl.join("~");
		}
	}
}
