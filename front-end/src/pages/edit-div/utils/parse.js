// 模拟后台数据
const templateData =
  "你是一名$${老师-请输入角色-角色}$$，请帮我撰写一封年度感恩回顾信，真诚表达对$${it部门-请输入对象-对象}$$在过去一年里支持与帮助的感激之情，并希望内容能展现出的$${-请输入内容风格-内容风格}$$特点";

export const dataMap = {
  角色: [
    "团队负责人",
    "前端工程师",
    "H5",
    "后端工程师",
    "产品经理",
    "设计师",
    "测试工程师",
    "运营",
    "项目经理",
    "CTO",
  ],
  对象: ["销售部", "财务部", "人事部", "行政部", "市场部", "运营部", "IT部"],
  内容风格: ["优雅", "时尚", "接地气", "隆重", "轻松"],
};

// 解析模板字符串
export function parseTemplate(template) {
  const regex = /\$\$\{(.*?)\}\$\$/g;
  let lastIndex = 0;
  const elements = [];

  template.replace(regex, (match, content, index) => {
    // 添加前面的静态文本
    if (index > lastIndex) {
      elements.push({
        type: "text",
        content: template.slice(lastIndex, index),
      });
    }

    // 解析动态内容
    const [displayText, placeholder, id] = content.split(/-/);
    elements.push({
      type: "input",
      displayText: displayText.trim(),
      placeholder: placeholder.trim(),
      id: id.trim(),
    });

    lastIndex = index + match.length;
    return match;
  });

  // 添加最后的静态文本
  if (lastIndex < template.length) {
    elements.push({
      type: "text",
      content: template.slice(lastIndex),
    });
  }
  return elements;
}

export const elements = parseTemplate(templateData);
