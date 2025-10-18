// apps/my-blog-frontend-ver2/src/components/ProfileEditModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UserForProfile, UpdateUserData } from '@my-blog/types';
import { updateUserProfile } from '@/api/user';
import { X } from 'lucide-react';

interface ProfileEditModalProps {
    user: UserForProfile
    onClose: () => void;
}
export default function ProfileEditModal({ user, onClose }: ProfileEditModalProps) {
    const queryClient = useQueryClient();
    const [nickname, setNickname] = useState(user.nickname);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(''); // 보안을 위해 비밀번호는 비워둡니다.
    const [passwordConfirm, setPasswordConfirm] = useState('');
    // ✅ 2. 비밀번호 일치 여부를 실시간으로 확인하는 상태 추가
    const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);

    // ✅ 3. password 또는 passwordConfirm 값이 바뀔 때마다 일치 여부를 검사
    useEffect(() => {
        // 두 필드 모두에 값이 있고, 두 값이 다를 때만 불일치로 판단
        if (password && passwordConfirm && password !== passwordConfirm) {
            setIsPasswordMismatch(true); // 다름
        } else {
            setIsPasswordMismatch(false); // 같음
        }
    }, [password, passwordConfirm]);

    const { 
        mutate: updateUserProfileAction,
        isPending 
    } = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: () => {
            alert('프로필이 성공적으로 업데이트되었습니다.');
            queryClient.invalidateQueries({ queryKey: ['user', user.id] });
            queryClient.invalidateQueries({ queryKey: ['me'] }); // useUser 훅 데이터도 갱신
            onClose();
        },
        onError: (error) => {
            alert(`업데이트 실패: ${error.message}`);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // ✅ 4. 제출 시 한 번 더 비밀번호 일치 여부 확인
        if (password !== passwordConfirm) {
            alert('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
            return;
        }
        
        const userId = user.id
        const updateUserData: UpdateUserData = { nickname, email };
        // 비밀번호 입력란에 값이 있을 경우에만 객체에 추가합니다.
        if (password) {
            updateUserData.password = password;
        }
        updateUserProfileAction({ userId , updateUserData });
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold">프로필 수정</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="email" className="text-sm font-semibold">이메일</label>
                        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="nickname" className="text-sm font-semibold">닉네임</label>
                        <input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} className="w-full mt-1 p-2 border rounded-md" required />
                    </div>

                    {/* 새 비밀번호 */}
                    <div>
                        <label htmlFor="password"  className="text-sm font-semibold">새 비밀번호</label>
                        <input 
                            id="password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="변경할 경우에만 입력하세요" 
                            // ✅ 불일치 시, 빨간색 테두리 적용
                            className={`w-full mt-1 p-2 border rounded-md ${isPasswordMismatch ? 'border-red-500' : 'border-gray-300'}`} 
                        />
                    </div>

                    {/* 새 비밀번호 확인 */}
                    <div>
                        <label htmlFor="passwordConfirm"  className="text-sm font-semibold">새 비밀번호 확인</label>
                        <input 
                            id="passwordConfirm" 
                            type="password" 
                            value={passwordConfirm} 
                            onChange={(e) => setPasswordConfirm(e.target.value)} 
                            placeholder="비밀번호를 다시 입력하세요" 
                            // ✅ 불일치 시, 빨간색 테두리 적용
                            className={`w-full mt-1 p-2 border rounded-md ${isPasswordMismatch ? 'border-red-500' : 'border-gray-300'}`} 
                        />
                        {/* ✅ 불일치 시, 에러 메시지 표시 */}
                        {isPasswordMismatch && (
                            <p className="mt-1 text-sm text-red-600">
                                비밀번호가 일치하지 않습니다.
                            </p>
                        )}
                    </div>


                    <div className="flex justify-end pt-4">
                        <button type="submit" disabled={isPending || isPasswordMismatch} className="px-6 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 disabled:bg-blue-300">
                            {isPending ? '저장 중...' : '저장'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}