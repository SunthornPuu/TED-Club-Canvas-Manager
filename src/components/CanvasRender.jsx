import React, { forwardRef } from 'react';

// All colors as hex to avoid oklch() which html2canvas cannot parse
const C = {
  red: '#c23b22',
  redLight: '#fbe4e4',
  redMid: '#f09a93',
  yellow: '#f9db9f',
  green: '#d7f7e2',
  greenText: '#006600',
  gray: '#f2f2f2',
  border: '#d1d5db',
  text: '#1e293b',
  white: '#ffffff',
};

const borderStyle = `1px solid ${C.border}`;

const CanvasRender = forwardRef(({ staticData, sessions }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        backgroundColor: C.white,
        padding: '24px',
        width: '1500px',
        fontFamily: 'Inter, Arial, sans-serif',
        color: C.text,
        fontSize: '14px',
        lineHeight: '1.5',
        overflowWrap: 'break-word'
      }}
    >
      {/* Top Banner */}
      <div style={{ width: '100%', backgroundColor: C.red, color: C.white, textAlign: 'center', fontWeight: 'bold', padding: '8px 0', marginBottom: '4px', fontSize: '18px' }}>
        TED Club Canvas
      </div>

      {/* Top Section Grid */}
      <div style={{ display: 'flex', width: '100%', marginBottom: '4px', border: borderStyle }}>
        <div style={{ width: '256px', flexShrink: 0, borderRight: borderStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '16px' }}>
          <span style={{ color: C.red, fontWeight: 'bold', fontSize: '24px', whiteSpace: 'nowrap' }}>TED<br />Club</span>
          <span style={{ color: C.red, fontWeight: 600, fontSize: '18px', whiteSpace: 'nowrap', marginTop: '4px' }}>TEDxBangkok<br />Youth</span>
        </div>
        <div style={{ flex: 1, display: 'flex' }}>
          {/* Persona */}
          <div style={{ flex: 1, borderRight: borderStyle, display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: C.red, color: C.white, textAlign: 'center', fontWeight: 'bold', padding: '8px 0', borderBottom: borderStyle, textTransform: 'uppercase', lineHeight: '1.3' }}>
              PERSONA<br /><span style={{ fontSize: '12px', fontWeight: 'normal' }}>เด็กนักเรียน</span>
            </div>
            <div style={{ flex: 1, backgroundColor: C.redLight, padding: '16px', whiteSpace: 'pre-wrap', minHeight: '120px', color: C.text }}>{staticData?.persona}</div>
          </div>
          {/* Agreement */}
          <div style={{ flex: 1, borderRight: borderStyle, display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: C.red, color: C.white, textAlign: 'center', fontWeight: 'bold', padding: '8px 0', borderBottom: borderStyle, textTransform: 'uppercase', lineHeight: '1.3' }}>
              AGREEMENT<br /><span style={{ fontSize: '12px', fontWeight: 'normal' }}>ข้อตกลงร่วมกัน</span>
            </div>
            <div style={{ flex: 1, backgroundColor: C.redLight, padding: '16px', whiteSpace: 'pre-wrap', minHeight: '120px', color: C.text }}>{staticData?.agreement}</div>
          </div>
          {/* Concept */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ backgroundColor: C.red, color: C.white, textAlign: 'center', fontWeight: 'bold', padding: '8px 0', borderBottom: borderStyle, textTransform: 'uppercase', lineHeight: '1.3' }}>
              CONCEPT<br /><span style={{ fontSize: '12px', fontWeight: 'normal' }}>&nbsp;</span>
            </div>
            <div style={{ flex: 1, backgroundColor: C.redMid, padding: '16px', whiteSpace: 'pre-wrap', minHeight: '120px', color: C.text }}>{staticData?.concept}</div>
          </div>
        </div>
      </div>

      {/* Middle Section Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: borderStyle, tableLayout: 'fixed', marginTop: '8px' }}>
        <thead>
          <tr>
            <th style={{ width: '256px', backgroundColor: C.gray, border: borderStyle, padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>SESSION</th>
            {sessions.map(s => (
              <th key={s.sessionNumber} style={{ backgroundColor: C.redLight, color: C.red, border: borderStyle, padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>{s.sessionNumber}</th>
            ))}
            <th style={{ width: '256px', backgroundColor: C.gray, border: borderStyle, padding: '12px', fontWeight: 'bold', textAlign: 'center' }}>หมายเหตุ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th style={{ backgroundColor: C.gray, border: borderStyle, padding: '16px', textAlign: 'left', verticalAlign: 'top', lineHeight: '1.3', height: '120px' }}>TOPIC<br />หัวข้อ</th>
            {sessions.map(s => <td key={s.sessionNumber} style={{ border: borderStyle, padding: '16px', verticalAlign: 'top', whiteSpace: 'pre-wrap', height: '120px', color: C.text }}>{s.topic}</td>)}
            <td style={{ border: borderStyle, padding: '16px', verticalAlign: 'top' }}></td>
          </tr>
          <tr>
            <th style={{ backgroundColor: C.gray, border: borderStyle, padding: '16px', textAlign: 'left', verticalAlign: 'top', height: '120px' }}>จุดประสงค์</th>
            {sessions.map(s => <td key={s.sessionNumber} style={{ border: borderStyle, padding: '16px', verticalAlign: 'top', whiteSpace: 'pre-wrap', height: '120px', color: C.text }}>{s.objective}</td>)}
            <td style={{ border: borderStyle, padding: '16px', verticalAlign: 'top' }}></td>
          </tr>
          <tr>
            <th style={{ backgroundColor: C.gray, border: borderStyle, padding: '16px', textAlign: 'left', verticalAlign: 'top', height: '120px' }}>กิจกรรม</th>
            {sessions.map(s => <td key={s.sessionNumber} style={{ border: borderStyle, padding: '16px', verticalAlign: 'top', whiteSpace: 'pre-wrap', height: '120px', color: C.text }}>{s.activity}</td>)}
            <td style={{ border: borderStyle, padding: '16px', verticalAlign: 'top' }}></td>
          </tr>
          <tr>
            <th style={{ backgroundColor: C.gray, border: borderStyle, padding: '16px', textAlign: 'left', verticalAlign: 'top', height: '120px' }}>การบ้าน</th>
            {sessions.map(s => <td key={s.sessionNumber} style={{ border: borderStyle, padding: '16px', verticalAlign: 'top', whiteSpace: 'pre-wrap', height: '120px', color: C.text }}>{s.homework}</td>)}
            <td style={{ border: borderStyle, padding: '16px', verticalAlign: 'top' }}></td>
          </tr>
        </tbody>
      </table>

      {/* Red Separator */}
      <div style={{ width: '100%', backgroundColor: C.red, height: '16px', marginTop: '4px', marginBottom: '4px' }}></div>

      {/* Bottom Section Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', border: borderStyle, tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <th style={{ width: '256px', backgroundColor: C.gray, border: borderStyle, padding: '16px', textAlign: 'left', verticalAlign: 'top' }}>ความเสี่ยง / ปัญหา</th>
            <th style={{ border: borderStyle, padding: '16px', backgroundColor: C.yellow, textAlign: 'center', fontWeight: 'normal' }} colSpan={Math.max(1, Math.floor(sessions.length / 2))}>
              ความเสี่ยง 1<br /><span style={{ whiteSpace: 'pre-wrap', marginTop: '8px', display: 'block', fontWeight: 'bold', color: C.text, textAlign: 'left', minHeight: '60px' }}>{staticData?.risk1}</span>
            </th>
            <th style={{ border: borderStyle, padding: '16px', backgroundColor: C.yellow, textAlign: 'center', fontWeight: 'normal' }} colSpan={Math.max(1, Math.ceil(sessions.length / 2))}>
              ความเสี่ยง 2<br /><span style={{ whiteSpace: 'pre-wrap', marginTop: '8px', display: 'block', fontWeight: 'bold', color: C.text, textAlign: 'left', minHeight: '60px' }}>{staticData?.risk2}</span>
            </th>
            <th style={{ width: '256px', backgroundColor: C.gray, border: borderStyle, padding: '16px', textAlign: 'left', verticalAlign: 'top', fontWeight: 'bold' }}>NOTE</th>
          </tr>
          <tr>
            <th style={{ backgroundColor: C.gray, border: borderStyle, padding: '16px', textAlign: 'left', verticalAlign: 'top' }} rowSpan={2}>วิธีแก้</th>
            <td style={{ border: borderStyle, padding: '16px', backgroundColor: C.green, verticalAlign: 'top', height: '100px' }} colSpan={Math.max(1, Math.floor(sessions.length / 2))}>
              <span style={{ fontSize: '12px', color: C.greenText, fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>วิธีแก้ไข 1</span>
              <span style={{ whiteSpace: 'pre-wrap', color: C.text }}>{staticData?.risk1_sol1}</span>
            </td>
            <td style={{ border: borderStyle, padding: '16px', backgroundColor: C.green, verticalAlign: 'top', height: '100px' }} colSpan={Math.max(1, Math.ceil(sessions.length / 2))}>
              <span style={{ fontSize: '12px', color: C.greenText, fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>วิธีแก้ไข 1</span>
              <span style={{ whiteSpace: 'pre-wrap', color: C.text }}>{staticData?.risk2_sol1}</span>
            </td>
            <td style={{ border: borderStyle, padding: '16px', verticalAlign: 'top', whiteSpace: 'pre-wrap', backgroundColor: C.white, color: C.text }} rowSpan={2}>
              {staticData?.globalNote}
            </td>
          </tr>
          <tr>
            <td style={{ border: borderStyle, padding: '16px', backgroundColor: C.green, verticalAlign: 'top', height: '100px' }} colSpan={Math.max(1, Math.floor(sessions.length / 2))}>
              <span style={{ fontSize: '12px', color: C.greenText, fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>วิธีแก้ไข 2</span>
              <span style={{ whiteSpace: 'pre-wrap', color: C.text }}>{staticData?.risk1_sol2}</span>
            </td>
            <td style={{ border: borderStyle, padding: '16px', backgroundColor: C.green, verticalAlign: 'top', height: '100px' }} colSpan={Math.max(1, Math.ceil(sessions.length / 2))}>
              <span style={{ fontSize: '12px', color: C.greenText, fontWeight: 'bold', display: 'block', marginBottom: '4px' }}>วิธีแก้ไข 2</span>
              <span style={{ whiteSpace: 'pre-wrap', color: C.text }}>{staticData?.risk2_sol2}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
});

export default CanvasRender;
