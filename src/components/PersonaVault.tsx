"use client";

import { useState } from 'react';
import { Persona, usePersonas } from '@/hooks/usePersonas';

export default function PersonaVault() {
  const { personas, addPersona, updatePersona, deletePersona, isLoaded } = usePersonas();
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // 폼 상태
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exampleText, setExampleText] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setExampleText('');
  };

  const handleEdit = (p: Persona) => {
    setEditingId(p.id);
    setName(p.name);
    setDescription(p.description);
    setExampleText(p.exampleText || '');
  };

  const handleSave = () => {
    if (!name.trim() || !description.trim()) {
      alert('이름과 페르소나 설명을 모두 입력해주세요.');
      return;
    }

    if (editingId) {
      updatePersona(editingId, { name, description, exampleText });
    } else {
      addPersona({ name, description, exampleText });
    }
    resetForm();
  };

  if (!isLoaded) {
    return <div className="p-24">로딩 중...</div>;
  }

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px 120px' }}>
      <div className="flex-col gap-24">
        
        {/* 헤더 */}
        <div className="card" style={{ padding: '36px', border: '1px solid var(--border-color)', backgroundColor: '#ffffff' }}>
          <h2 className="font-bold-20 m-b-8">🎭 나의 페르소나 저장소</h2>
          <p className="font-14 text-muted">자주 사용하는 문체, 말투, 캐릭터를 저장해두고 원클릭으로 글에 적용하세요.</p>
        </div>

        <div className="flex-row gap-24" style={{ alignItems: 'flex-start' }}>
          
          {/* 좌측: 목록 */}
          <div className="flex-1 flex-col gap-16">
            <h3 className="font-bold-16">내 페르소나 목록 ({personas.length}개)</h3>
            
            {personas.length === 0 ? (
              <div className="p-24 text-center font-14 text-light" style={{ backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
                아직 생성된 페르소나가 없습니다.<br/>우측에서 새 페르소나를 만들어보세요!
              </div>
            ) : (
              personas.map(p => (
                <div key={p.id} className="card p-20 cursor-pointer" style={{ border: editingId === p.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)' }} onClick={() => handleEdit(p)}>
                  <div className="flex-row justify-between items-center m-b-8">
                    <h4 className="font-bold-15">{p.name}</h4>
                    <button onClick={(e) => { e.stopPropagation(); deletePersona(p.id); }} className="text-light hover:text-danger" style={{ backgroundColor: 'transparent', padding: '4px' }}>삭제</button>
                  </div>
                  <p className="font-13 text-muted" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                </div>
              ))
            )}
            
            {editingId && (
              <button onClick={resetForm} className="btn-outline w-full justify-center p-12 mt-4" style={{ borderRadius: '8px' }}>
                + 새 페르소나 만들기
              </button>
            )}
          </div>

          {/* 우측: 폼 */}
          <div className="flex-1 card p-24" style={{ border: '1px solid var(--border-color)', backgroundColor: '#f9fafb' }}>
            <h3 className="font-bold-16 m-b-24">{editingId ? '페르소나 수정' : '새 페르소나 추가'}</h3>
            
            <div className="flex-col gap-16 m-b-24">
              <div>
                <label className="font-bold-13 text-muted m-b-8 block">페르소나 이름 <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="예: 30대 육아맘 블로거" 
                  className="w-full font-14" 
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }} 
                />
              </div>

              <div>
                <label className="font-bold-13 text-muted m-b-8 block">캐릭터 설명 (AI 시스템 프롬프트용) <span className="text-danger">*</span></label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="예: 저는 30대 후반의 긍정적인 여성입니다. 독자들에게 '친근하게 공감'하는 성격이며, 이모티콘을 종종 씁니다." 
                  className="w-full font-14" 
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '120px', resize: 'vertical' }} 
                />
                <p className="font-11 text-light m-t-4">구체적으로 적을수록 AI가 더 정확하게 말투를 모방합니다.</p>
              </div>

              <div>
                <label className="font-bold-13 text-muted m-b-8 block">나만의 예시 글 (선택)</label>
                <textarea 
                  value={exampleText} 
                  onChange={e => setExampleText(e.target.value)} 
                  placeholder="본인이 평소에 쓰는 말투가 잘 드러난 문단 1~2개를 붙여넣으세요. AI가 말투를 완벽하게 카피합니다." 
                  className="w-full font-14" 
                  style={{ padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', minHeight: '100px', resize: 'vertical' }} 
                />
              </div>
            </div>

            <button onClick={handleSave} className="btn-primary w-full justify-center p-12 font-bold-14" style={{ borderRadius: '8px' }}>
              {editingId ? '변경사항 저장하기' : '페르소나 생성하기'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
