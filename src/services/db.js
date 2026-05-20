import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../config/firebase';

// 1. Adicionar um novo veículo
export const addVehicle = async (userId, vehicleData) => {
  try {
    const docRef = await addDoc(collection(db, 'vehicles'), {
      ...vehicleData,
      ownerId: userId,
      healthScore: 100, // Começa com 100% no MVP
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar veículo: ", error);
    throw error;
  }
};

// 2. Atualizar os dados de um veículo existente
export const updateVehicle = async (vehicleId, updatedData) => {
  try {
    const vehicleRef = doc(db, 'vehicles', vehicleId);
    const { id, ...dataToUpdate } = updatedData;
    
    await updateDoc(vehicleRef, {
      ...dataToUpdate,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao atualizar veículo: ", error);
    throw error;
  }
};

// 3. Buscar veículos do usuário logado
export const getUserVehicles = async (userId) => {
  try {
    const q = query(collection(db, 'vehicles'), where("ownerId", "==", userId));
    const querySnapshot = await getDocs(q);
    
    const vehicles = [];
    querySnapshot.forEach((doc) => {
      vehicles.push({ id: doc.id, ...doc.data() });
    });
    
    return vehicles;
  } catch (error) {
    console.error("Erro ao buscar veículos: ", error);
    throw error;
  }
};

// 4. Buscar histórico de manutenção
export const getVehicleLogs = async (vehicleId) => {
  try {
    const q = query(collection(db, 'maintenance_logs'), where("vehicleId", "==", vehicleId));
    const querySnapshot = await getDocs(q);
    
    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });
    
    return logs.sort((a, b) => Number(b.kmAtService) - Number(a.kmAtService));
  } catch (error) {
    console.error("Erro ao buscar histórico: ", error);
    throw error;
  }
};

// 5. Adicionar um log de manutenção
export const addMaintenanceLog = async (vehicleId, logData) => {
  try {
    const docRef = await addDoc(collection(db, 'maintenance_logs'), {
      ...logData,
      vehicleId,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Erro ao adicionar histórico: ", error);
    throw error;
  }
};

// 6. Atualizar um log de manutenção existente (NOVO)
export const updateMaintenanceLog = async (logId, updatedData) => {
  try {
    const logRef = doc(db, 'maintenance_logs', logId);
    const { id, createdAt, ...dataToUpdate } = updatedData; // Evita sobrescrever ID e Data de criação original
    
    await updateDoc(logRef, {
      ...dataToUpdate,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erro ao atualizar histórico: ", error);
    throw error;
  }
};