const STORAGE_KEY = 'agency_crm_scan_leads_v1';
const SEED = [
  {"id":"1x5i47y","subreddit":"r/CRM","title":"Which CRM do you recommend","url":"https://www.reddit.com/r/CRM/comments/1x5i47y/which_crm_do_you_recommend/","author":"SalesLeadPro","score":2,"comments":153,"keyword":"which crm should i use"},
  {"id":"1x5jrmf","subreddit":"r/CRMSoftware","title":"What CRM are you using for your small business?","url":"https://www.reddit.com/r/CRMSoftware/comments/1x5jrmf/what_crm_are_you_using_for_your_small_business/","author":"SMB_Owner_22","score":2,"comments":137,"keyword":"best crm for small business"},
  {"id":"1wdihhj","subreddit":"r/CRM","title":"What CRM should a small business use?","url":"https://www.reddit.com/r/CRM/comments/1wdihhj/what_crm_should_a_small_business_use/","author":"BizBuilder","score":2,"comments":197,"keyword":"best crm for small business"},
  {"id":"1xy4230","subreddit":"r/CRM","title":"What's the best CRM for a small startup sales team that can handle more than just tracking deals?","url":"https://www.reddit.com/r/CRM/comments/1xy4230/whats_the_best_crm_for_a_small_startup_sales_team/","author":"StartupFounder91","score":2,"comments":47,"keyword":"best crm for small business"},
  {"id":"1xwgv2y","subreddit":"r/CRM","title":"Looking for a simpler, more affordable alternative to HubSpot. Any recommendations?","url":"https://www.reddit.com/r/CRM/comments/1xwgv2y/looking_for_a_simpler_more_affordable_alternative/","author":"FrugalFounder","score":2,"comments":42,"keyword":"best crm for small business"},
  {"id":"1wx54w1","subreddit":"r/CRMSoftware","title":"What's the best CRM if I hate doing CRM admin?","url":"https://www.reddit.com/r/CRMSoftware/comments/1wx54w1/whats_the_best_crm_if_i_hate_doing_crm_admin/","author":"AdminHater","score":2,"comments":42,"keyword":"which crm should i use"},
  {"id":"1x0u7g1","subreddit":"r/CRM","title":"Best CRM to use","url":"https://www.reddit.com/r/CRM/comments/1x0u7g1/best_crm_to_use/","author":"GrowthCo","score":2,"comments":37,"keyword":"which crm should i use"},
  {"id":"1xebqew","subreddit":"r/CRMSoftware","title":"What are CRM for WhatsApp recommendations for a small business drowning in chats","url":"https://www.reddit.com/r/CRMSoftware/comments/1xebqew/what_are_crm_for_whatsapp_recommendations_for_a/","author":"ChatOverwhelmed","score":2,"comments":33,"keyword":"recommend a crm"},
  {"id":"1xrr16u","subreddit":"r/CRMSoftware","title":"CRM website recommendations for a business where privacy matters more than volume","url":"https://www.reddit.com/r/CRMSoftware/comments/1xrr16u/crm_website_recommendations_for_a_business_where/","author":"PrivacyFirst","score":2,"comments":26,"keyword":"recommend a crm"},
  {"id":"1xxsx11","subreddit":"r/onlyfansadvice","title":"Everyone's been recommending I get a CRM, which ones are good?","url":"https://www.reddit.com/r/onlyfansadvice/comments/1xxsx11/everyones_been_recommending_i_get_a_crm_which/","author":"CreatorGrowth","score":2,"comments":7,"keyword":"recommend a crm"}
];

function load() {
  try { const r = localStorage.getItem(STORAGE_KEY); if (r) return JSON.parse(r); } catch(e) {}
  return SEED;
}
function save(v) { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); }
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function draft(a) {
  return "Hi " + a + ", saw your post - we built a tool that does exactly this (social listening + automated outreach with human approval). Happy to share a 5-min demo. Would a quick call work this week?";
}

let leads = load();

function render() {
  document.getElementById('s-leads').textContent = leads.length;
  document.getElementById('s-drafts').textContent = leads.length;
  const body = document.getElementById('scanBody');
  body.innerHTML = '';
  leads.forEach(l => {
    const tr = document.createElement('tr');
    tr.innerHTML =
      '<td>' + esc(l.subreddit) + '</td>' +
      '<td class="post"><a href="' + esc(l.url) + '" target="_blank" rel="noopener" style="color:var(--accent)">' + esc(l.title) + '</a></td>' +
      '<td>' + esc(l.author) + '</td>' +
      '<td>' + l.score + '</td>' +
      '<td>' + l.comments + '</td>' +
      '<td class="draft">' + esc(draft(l.author)) + '</td>';
    body.appendChild(tr);
  });
}

function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.hidden = false;
  clearTimeout(toast._t); toast._t = setTimeout(()=>t.hidden=true, 2200);
}

document.getElementById('refreshBtn').addEventListener('click', () => {
  leads = load(); render(); toast('Scan refreshed');
});
render();