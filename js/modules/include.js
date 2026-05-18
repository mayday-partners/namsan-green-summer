// js/modules/include.js
// data-include 속성을 가진 요소를 fetch 결과로 대체한다.
// 실패 시 해당 요소만 비우고 console.error.
export async function mountIncludes(root = document) {
  const slots = root.querySelectorAll('[data-include]');
  if (!slots.length) return;

  await Promise.all([...slots].map(async (el) => {
    const url = el.dataset.include;
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const html = await res.text();
      // outerHTML 교체 시 NodeList 무효화는 이미 [...slots]로 스냅샷됨
      el.outerHTML = html;
    } catch (err) {
      console.error('[include]', url, err);
      el.innerHTML = `<p role="alert" style="padding:1rem;color:#FF0F7B">콘텐츠 로딩 실패: ${url}</p>`;
    }
  }));
}
