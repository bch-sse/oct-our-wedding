// 배경사진 자동 적용: photos/21.jpg 파일을 넣으면 히어로 배경으로 뜹니다.
(function(){
  const hero=document.getElementById('hero');
  const img=new Image();
  img.onload=function(){
    hero.style.setProperty('--hero-img','url("photos/21.jpg")');
    hero.classList.add('has-photo');
  };
  img.src='photos/21.jpg';
})();

// 실시간 카운트다운 (예식 일시를 본인 것으로 수정하세요)
(function(){
  // 2026년 10월 24일 오후 1시 40분 (월은 0부터: 9=10월)
  const wedding=new Date(2026,9,24,13,40,0);
  const d=document.getElementById('cd-d');
  const h=document.getElementById('cd-h');
  const m=document.getElementById('cd-m');
  const s=document.getElementById('cd-s');
  const label=document.querySelector('.count-label');
  if(!d) return;
  const pad=n=>String(n).padStart(2,'0');
  function tick(){
    const now=new Date();
    let diff=Math.floor((wedding-now)/1000);
    if(diff<=0){
      label.textContent='오늘은 저희의 결혼식입니다 🎉';
      d.textContent='00';h.textContent='00';m.textContent='00';s.textContent='00';
      clearInterval(timer);
      return;
    }
    const days=Math.floor(diff/86400); diff%=86400;
    const hrs=Math.floor(diff/3600); diff%=3600;
    const mins=Math.floor(diff/60);
    const secs=diff%60;
    d.textContent=pad(days);
    h.textContent=pad(hrs);
    m.textContent=pad(mins);
    s.textContent=pad(secs);
  }
  tick();
  const timer=setInterval(tick,1000);
})();

// 카카오맵 표시 (주소를 좌표로 변환해서 마커 표시)
(function(){
  const el=document.getElementById('kakaoMap');
  if(!el) return;
  const VENUE='서울특별시 강남구 언주로 508';   // 예식장 주소
  const VENUE_NAME='상록아트홀 그랜드볼룸';

  function showFallback(){
    el.innerHTML='<div class="map-fallback">지도를 불러오지 못했습니다.<br>아래 지도 앱 버튼을 눌러 위치를 확인해 주세요.</div>';
  }
  // SDK 로드 실패(키 미설정 등) 시 안내
  if(typeof kakao==='undefined'||!kakao.maps){
    showFallback();
    return;
  }
  kakao.maps.load(function(){
    const geocoder=new kakao.maps.services.Geocoder();
    geocoder.addressSearch(VENUE, function(result,status){
      if(status===kakao.maps.services.Status.OK){
        const coords=new kakao.maps.LatLng(result[0].y, result[0].x);
        const map=new kakao.maps.Map(el,{center:coords,level:4});
        const marker=new kakao.maps.Marker({map:map,position:coords});
        const iw=new kakao.maps.InfoWindow({
          content:'<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">'+VENUE_NAME+'</div>'
        });
        iw.open(map,marker);
        map.setDraggable(true);
        // 마커 클릭 시 카카오맵 길찾기로 이동
        kakao.maps.event.addListener(marker,'click',function(){
          window.open('https://map.kakao.com/?q='+encodeURIComponent(VENUE_NAME));
        });
      }else{
        showFallback();
      }
    });
  });
})();

// 계좌 접기
function toggleAcc(btn){
  const g=btn.parentElement;
  const body=g.querySelector('.acc-body');
  const open=g.classList.toggle('open');
  body.style.maxHeight=open?body.scrollHeight+'px':'0';
}
// 계좌 복사
function copyAcc(btn,num){
  navigator.clipboard.writeText(num).then(()=>{
    const t=btn.textContent;
    btn.textContent='복사됨';btn.classList.add('done');
    setTimeout(()=>{btn.textContent=t;btn.classList.remove('done')},1400);
  }).catch(()=>{
    // 클립보드 미지원 폴백
    prompt('계좌번호를 복사하세요',num);
  });
}
// 갤러리 라이트박스 (사진 넣으면 data-src에 경로 지정)
document.querySelectorAll('#grid .cell').forEach(c=>{
  c.addEventListener('click',()=>{
    const src=c.dataset.src;
    if(!src) return;
    document.getElementById('lb-img').src=src;
    document.getElementById('lb').classList.add('on');
  });
});
function closeLb(e){
  if(e.target.id==='lb'||e.target.classList.contains('close')||e.target.id==='lb-img'){
    document.getElementById('lb').classList.remove('on');
  }
}
// 스크롤 등장
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')});
},{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
