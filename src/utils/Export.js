import html2pdf from 'html2pdf.js';

const exportPdf = (name, domName) => {
  // 要导出的dom节点，注意如果使用class控制样式，一定css规则
  const element = document.getElementsByClassName(domName)[0];
  // 导出配置
  const opt = {
    margin: 1,
    filename: name,
    image: { type: 'jpeg', quality: 0.98 }, // 导出的图片质量和格式
    html2canvas: { scale: 2, useCORS: true }, // useCORS很重要，解决文档中图片跨域问题
    jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
  };
  if (element) {
    html2pdf()
      .set(opt)
      .from(element)
      .save(); // 导出
  }
};
export default exportPdf;
