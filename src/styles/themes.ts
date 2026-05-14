export interface ThemeStyles {
  container: React.CSSProperties;
  h1: React.CSSProperties;
  h2: React.CSSProperties;
  h3: React.CSSProperties;
  p: React.CSSProperties;
  blockquote: React.CSSProperties;
  code: React.CSSProperties;
  pre: React.CSSProperties;
  ul: React.CSSProperties;
  ol: React.CSSProperties;
  li: React.CSSProperties;
  link: React.CSSProperties;
  strong: React.CSSProperties;
  table: React.CSSProperties;
  thead: React.CSSProperties;
  tbody: React.CSSProperties;
  tr: React.CSSProperties;
  th: React.CSSProperties;
  td: React.CSSProperties;
}

export interface Theme {
  id: string;
  name: string;
  styles: ThemeStyles;
}

export const THEMES: Theme[] = [
  {
    id: 'default',
    name: '默认',
    styles: {
      container: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.75',
        color: '#333',
        wordBreak: 'break-word',
      },
      h1: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: '20px',
        marginTop: '30px',
        borderBottom: '2px solid #eee',
        paddingBottom: '10px',
      },
      h2: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '15px',
        marginTop: '25px',
      },
      h3: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#444',
        marginBottom: '12px',
        marginTop: '20px',
      },
      p: {
        marginBottom: '16px',
        textAlign: 'justify',
      },
      blockquote: {
        borderLeft: '4px solid #ddd',
        paddingLeft: '16px',
        color: '#666',
        fontStyle: 'italic',
        margin: '20px 0',
      },
      code: {
        backgroundColor: '#f5f5f5',
        padding: '2px 4px',
        borderRadius: '4px',
        fontFamily: 'monospace',
      },
      pre: {
        backgroundColor: '#282c34',
        color: '#abb2bf',
        padding: '16px',
        borderRadius: '8px',
        overflowX: 'auto',
        margin: '20px 0',
      },
      ul: {
        paddingLeft: '20px',
        marginBottom: '16px',
      },
      ol: {
        paddingLeft: '20px',
        marginBottom: '16px',
      },
      li: {
        marginBottom: '8px',
      },
      link: {
        color: '#0070f3',
        textDecoration: 'underline',
      },
      strong: {
        fontWeight: 'bold',
        color: '#000',
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
        border: '1px solid #ddd',
      },
      thead: {
        backgroundColor: '#f5f5f5',
      },
      tbody: {},
      tr: {
        borderBottom: '1px solid #ddd',
      },
      th: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
      },
      td: {
        padding: '12px',
        border: '1px solid #ddd',
      },
    },
  },
  {
    id: 'wechat-green',
    name: '微信绿',
    styles: {
      container: {
        fontFamily: 'Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#3e3e3e',
      },
      h1: {
        fontSize: '22px',
        fontWeight: 'bold',
        color: '#07c160',
        textAlign: 'center',
        margin: '40px 0 20px',
        padding: '10px',
        borderBottom: '2px solid #07c160',
      },
      h2: {
        fontSize: '19px',
        fontWeight: 'bold',
        color: '#ffffff',
        backgroundColor: '#07c160',
        padding: '8px 15px',
        borderRadius: '4px',
        display: 'inline-block',
        margin: '30px 0 15px',
      },
      h3: {
        fontSize: '17px',
        fontWeight: 'bold',
        color: '#07c160',
        borderLeft: '4px solid #07c160',
        paddingLeft: '10px',
        margin: '20px 0 10px',
      },
      p: {
        marginBottom: '1.5em',
        letterSpacing: '1px',
      },
      blockquote: {
        backgroundColor: '#f7f7f7',
        borderLeft: '4px solid #07c160',
        padding: '15px',
        color: '#666',
        margin: '20px 0',
      },
      code: {
        color: '#07c160',
        backgroundColor: '#f0f0f0',
        padding: '2px 4px',
        borderRadius: '3px',
      },
      pre: {
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        padding: '15px',
        borderRadius: '8px',
        margin: '20px 0',
      },
      ul: { paddingLeft: '20px', marginBottom: '16px' },
      ol: { paddingLeft: '20px', marginBottom: '16px' },
      li: { marginBottom: '8px' },
      link: {
        color: '#07c160',
        textDecoration: 'none',
        borderBottom: '1px solid #07c160',
      },
      strong: {
        fontWeight: 'bold',
        color: '#07c160',
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
        border: '1px solid #07c160',
      },
      thead: {
        backgroundColor: '#07c160',
      },
      tbody: {},
      tr: {
        borderBottom: '1px solid #07c160',
      },
      th: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
        backgroundColor: '#07c160',
        color: '#ffffff',
        border: '1px solid #07c160',
      },
      td: {
        padding: '12px',
        border: '1px solid #ddd',
      },
    },
  },
  {
    id: 'elegant-blue',
    name: '优雅蓝',
    styles: {
      container: {
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '17px',
        lineHeight: '1.8',
        color: '#2c3e50',
      },
      h1: {
        fontSize: '26px',
        color: '#2980b9',
        borderBottom: '1px solid #2980b9',
        paddingBottom: '5px',
        marginBottom: '25px',
        marginTop: '35px',
      },
      h2: {
        fontSize: '21px',
        color: '#2980b9',
        paddingLeft: '12px',
        borderLeft: '4px solid #2980b9',
        margin: '30px 0 15px',
      },
      h3: {
        fontSize: '19px',
        color: '#3498db',
        margin: '25px 0 12px',
      },
      p: {
        marginBottom: '18px',
        textIndent: '2em',
      },
      blockquote: {
        border: '1px solid #3498db',
        borderRadius: '8px',
        padding: '15px',
        backgroundColor: '#ebf5fb',
        color: '#2c3e50',
        margin: '20px 0',
      },
      code: {
        color: '#e74c3c',
        fontFamily: 'monospace',
      },
      pre: {
        backgroundColor: '#fdfdfd',
        border: '1px solid #ddd',
        padding: '15px',
        borderRadius: '4px',
        margin: '20px 0',
      },
      ul: { paddingLeft: '20px', marginBottom: '16px' },
      ol: { paddingLeft: '20px', marginBottom: '16px' },
      li: { marginBottom: '8px' },
      link: {
        color: '#2980b9',
        fontWeight: 'bold',
      },
      strong: {
        color: '#2c3e50',
        borderBottom: '2px solid #3498db',
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
        border: '1px solid #2980b9',
      },
      thead: {
        backgroundColor: '#2980b9',
      },
      tbody: {},
      tr: {
        borderBottom: '1px solid #ddd',
      },
      th: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
        backgroundColor: '#2980b9',
        color: '#ffffff',
        border: '1px solid #2980b9',
      },
      td: {
        padding: '12px',
        border: '1px solid #ddd',
      },
    },
  },
  {
    id: 'block-frame',
    name: '块',
    styles: {
      container: {
        fontFamily: '"Inter", "-apple-system", BlinkMacSystemFont, "Segoe UI", sans-serif',
        fontSize: '16px',
        lineHeight: '1.7',
        color: '#000000',
        backgroundColor: '#FFFDF5',
        wordBreak: 'break-word',
      },
      h1: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontSize: '2.2em',
        fontWeight: 800,
        lineHeight: '1.1',
        color: '#000000',
        backgroundColor: '#FE90E8',
        border: '4px solid #000000',
        padding: '12px 16px',
        marginTop: '0',
        marginBottom: '22px',
        display: 'inline-block',
        boxShadow: '8px 8px 0 #000000',
      },
      h2: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontSize: '1.6em',
        fontWeight: 800,
        lineHeight: '1.2',
        color: '#000000',
        backgroundColor: '#C0F7FE',
        border: '3px solid #000000',
        padding: '10px 14px',
        marginTop: '28px',
        marginBottom: '16px',
        display: 'inline-block',
        boxShadow: '6px 6px 0 #000000',
      },
      h3: {
        fontFamily: '"Space Grotesk", "Inter", sans-serif',
        fontSize: '1.2em',
        fontWeight: 700,
        letterSpacing: '0.02em',
        textTransform: 'uppercase',
        color: '#000000',
        backgroundColor: '#99E885',
        border: '3px solid #000000',
        padding: '8px 12px',
        marginTop: '24px',
        marginBottom: '14px',
        display: 'inline-block',
      },
      p: {
        marginBottom: '16px',
        color: '#000000',
      },
      blockquote: {
        margin: '22px 0',
        padding: '16px 18px',
        backgroundColor: '#FFDC8B',
        border: '4px solid #000000',
        color: '#000000',
        fontWeight: 600,
        boxShadow: '8px 8px 0 #000000',
      },
      code: {
        fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
        fontSize: '0.92em',
        backgroundColor: '#F7CB46',
        color: '#000000',
        border: '2px solid #000000',
        padding: '2px 6px',
      },
      pre: {
        fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
        backgroundColor: '#C0F7FE',
        color: '#000000',
        border: '4px solid #000000',
        padding: '16px',
        margin: '22px 0',
        overflowX: 'auto',
        boxShadow: '8px 8px 0 #000000',
      },
      ul: {
        paddingLeft: '24px',
        marginBottom: '16px',
      },
      ol: {
        paddingLeft: '24px',
        marginBottom: '16px',
      },
      li: {
        marginBottom: '8px',
      },
      link: {
        color: '#000000',
        fontWeight: 700,
        textDecoration: 'underline',
        textDecorationThickness: '3px',
        textDecorationColor: '#FE90E8',
      },
      strong: {
        fontWeight: 800,
        color: '#000000',
        backgroundColor: '#99E885',
        padding: '0 4px',
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '22px 0',
        border: '4px solid #000000',
        backgroundColor: '#FFFDF5',
        boxShadow: '8px 8px 0 #000000',
      },
      thead: {
        backgroundColor: '#FE90E8',
      },
      tbody: {},
      tr: {
        borderBottom: '3px solid #000000',
      },
      th: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: 800,
        color: '#000000',
        border: '3px solid #000000',
        backgroundColor: '#FE90E8',
      },
      td: {
        padding: '12px',
        color: '#000000',
        border: '3px solid #000000',
        backgroundColor: '#FFFDF5',
      },
    },
  },
  {
    id: 'summer-memory',
    name: '夏日记忆',
    styles: {
      container: {
        fontFamily: 'Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
        fontSize: '16px',
        lineHeight: '2',
        color: '#595755',
        letterSpacing: '1.5px',
        backgroundColor: '#fff',
        backgroundImage: 'url("https://img.xiumi.us/xmi/ua/19KxR/i/fcccec48e74e9ec4405253b1e438f339-sz_491646.png?x-oss-process=style/xmwebp")',
        backgroundRepeat: 'repeat-y',
        backgroundSize: '100%',
        padding: '40px 20px',
        wordBreak: 'break-word',
      },
      h1: {
        fontSize: '2.2em',
        fontWeight: 'bold',
        color: '#A9B660',
        textAlign: 'center',
        letterSpacing: '3px',
        margin: '40px 0 20px',
      },
      h2: {
        fontSize: '1.6em',
        fontWeight: 'bold',
        color: '#A9B660',
        borderBottom: '1px dashed #F5A518',
        paddingBottom: '10px',
        margin: '30px 0 15px',
      },
      h3: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#A9B660',
        fontStyle: 'italic',
        margin: '25px 0 10px',
      },
      p: {
        marginBottom: '1.5em',
        textAlign: 'justify',
      },
      blockquote: {
        borderLeft: '4px solid #F5A518',
        backgroundColor: 'rgba(245, 165, 24, 0.05)',
        padding: '15px',
        color: '#666',
        margin: '20px 0',
      },
      code: {
        backgroundColor: '#f5f5f5',
        padding: '2px 4px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        color: '#F5A518',
      },
      pre: {
        backgroundColor: '#f8f8f8',
        padding: '16px',
        borderRadius: '8px',
        overflowX: 'auto',
        margin: '20px 0',
        border: '1px solid #eee',
      },
      ul: { paddingLeft: '20px', marginBottom: '16px' },
      ol: { paddingLeft: '20px', marginBottom: '16px' },
      li: { marginBottom: '8px' },
      link: {
        color: '#F5A518',
        textDecoration: 'underline',
      },
      strong: {
        fontWeight: 'bold',
        color: '#A9B660',
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
        border: '1px solid #A9B660',
      },
      thead: {
        backgroundColor: '#A9B660',
      },
      tbody: {},
      tr: {
        borderBottom: '1px solid #eee',
      },
      th: {
        padding: '12px',
        textAlign: 'left',
        fontWeight: 'bold',
        backgroundColor: '#A9B660',
        color: '#ffffff',
      },
      td: {
        padding: '12px',
        border: '1px solid #eee',
      },
    },
  },
  {
    "id": "standard",
    "name": "标准",
    "styles": {
      "container": {
        "fontFamily": "Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, \"PingFang SC\", Cambria, Cochin, Georgia, Times, \"Times New Roman\", serif",
        "fontSize": "16px",
        "lineHeight": "1.6",
        "color": "#3e3e3e"
      },
      "h1": {
        "fontSize": "2em",
        "fontWeight": "bold",
        "marginTop": "0.67em",
        "marginBottom": "0.67em"
      },
      "h2": {
        "borderLeft": "solid #F5222D 1.0pt",
        "paddingLeft": "8.0pt",
        "color": "rgb(248, 173, 25)",
        "fontWeight": "bold",
        "letterSpacing": "0.034em",
        "fontSize": "1.5em",
        "marginTop": "0.83em",
        "marginBottom": "0.83em"
      },
      "h3": {
        "fontSize": "1.17em",
        "fontWeight": "bold",
        "marginTop": "1em",
        "marginBottom": "1em"
      },
      "p": {
        "marginTop": "6pt",
        "marginBottom": "6pt",
        "lineHeight": "1.92",
        "color": "#262626",
        "fontSize": "12pt",
        "fontFamily": "PingFang SC"
      },
      "blockquote": {
        "margin": "1em 40px",
        "padding": "0 15px",
        "borderLeft": "4px solid #ccc",
        "color": "#666"
      },
      "code": {
        "fontFamily": "monospace",
        "fontSize": "0.9em",
        "backgroundColor": "rgba(27,31,35,.05)",
        "padding": "0.2em 0.4em",
        "borderRadius": "3px"
      },
      "pre": {
        "fontFamily": "monospace",
        "fontSize": "0.9em",
        "backgroundColor": "#f6f8fa",
        "padding": "16px",
        "overflow": "auto",
        "lineHeight": "1.45",
        "borderRadius": "6px"
      },
      "ul": {
        "listStyleType": "disc",
        "marginLeft": "1.5em"
      },
      "ol": {
        "listStyleType": "decimal",
        "marginLeft": "1.5em"
      },
      "li": {
        "marginBottom": "0.5em"
      },
      "link": {
        "color": "#0366d6",
        "textDecoration": "none"
      },
      "strong": {
        "fontWeight": "bold"
      },
      "table": {
        "width": "100%",
        "borderCollapse": "collapse",
        "marginTop": "1em",
        "marginBottom": "1em"
      },
      "thead": {
        "backgroundColor": "#f6f8fa"
      },
      "tbody": {},
      "tr": {
        "borderTop": "1px solid #dfe2e5"
      },
      "th": {
        "padding": "6px 13px",
        "border": "1px solid #dfe2e5",
        "fontWeight": "bold",
        "textAlign": "left"
      },
      "td": {
        "padding": "6px 13px",
        "border": "1px solid #dfe2e5"
      }
    }
  },
  {
    id: 'pink-sakura',
    name: '粉色樱花',
    styles: {
      container: {
        fontFamily: 'Optima-Regular, Optima, PingFangSC-light, PingFangTC-light, "PingFang SC", Cambria, Cochin, Georgia, Times, "Times New Roman", serif',
        fontSize: '16px',
        lineHeight: '1.8',
        color: '#8A5C5F',
        backgroundColor: '#fff',
        backgroundImage: 'url("https://img.xiumi.us/xmi/ua/19KxR/i/788f0b43c050574f2d48a420a4f405d0-sz_80516.png?x-oss-process=style/xmwebp")',
        backgroundRepeat: 'repeat-y',
        backgroundSize: '100%',
        padding: '30px 20px',
        wordBreak: 'break-word',
      },
      h1: {
        fontSize: '2.5em',
        fontWeight: 'bold',
        color: '#EE8598',
        textAlign: 'center',
        letterSpacing: '2px',
        margin: '30px 0',
        textShadow: '2px 2px 0 #fff',
      },
      h2: {
        fontSize: '1.8em',
        fontWeight: 'bold',
        color: '#EE8598',
        borderBottom: '2px solid #EE8598',
        paddingBottom: '10px',
        margin: '25px 0 15px',
      },
      h3: {
        display: "inline-block",
        verticalAlign: "middle",
        width: "auto",
        alignSelf: "center",
        flex: "0 0 auto",
        backgroundColor: "rgb(254, 248, 230)",
        minWidth: "5%",
        maxWidth: "100%",
        height: "auto",
      },
      p: {
        marginBottom: '1.2em',
      },
      blockquote: {
        margin: '20px 0',
        padding: '15px 20px',
        backgroundColor: 'rgba(238, 133, 152, 0.05)',
        borderLeft: '4px solid #EE8598',
        color: '#8A5C5F',
        fontStyle: 'italic',
      },
      code: {
        backgroundColor: '#FCE5EB',
        color: '#EE8598',
        padding: '2px 4px',
        borderRadius: '3px',
        fontFamily: 'monospace',
      },
      pre: {
        backgroundColor: '#f9f9f9',
        padding: '16px',
        borderRadius: '5px',
        overflowX: 'auto',
        margin: '20px 0',
      },
      ul: { paddingLeft: '20px', marginBottom: '16px' },
      ol: { paddingLeft: '20px', marginBottom: '16px' },
      li: { marginBottom: '8px' },
      link: {
        color: '#EE8598',
        textDecoration: 'underline',
        textDecorationStyle: 'dotted',
      },
      strong: {
        fontWeight: 'bold',
        color: '#EE8598',
      },
      table: {
        width: '100%',
        borderCollapse: 'collapse',
        margin: '20px 0',
      },
      thead: {
        backgroundColor: '#EE8598',
      },
      tbody: {},
      tr: {
        borderBottom: '1px solid #ddd',
      },
      th: {
        padding: '10px',
        textAlign: 'left',
        fontWeight: 'bold',
        backgroundColor: '#EE8598',
        color: '#fff',
      },
      td: {
        padding: '10px',
        border: '1px solid #ddd',
      },
    },
  }
];
