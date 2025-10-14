// services/transactionService.js (FINAL FIXED)

import axiosClient from '../api/axiosClient'; 

/**
 * Gọi API Backend để khởi tạo và hoàn tất giao dịch nội bộ.
 * Endpoint: POST /api/transactions/initiate
 */
export async function initiatePayment(transactionDetails) {
    console.log('Đang gọi API Backend để khởi tạo và hoàn tất giao dịch nội bộ...');
    
    try {
        const response = await axiosClient.post('/transactions/initiate', transactionDetails); 
        return response.data; 

    } catch (error) {
        throw error;
    }
}