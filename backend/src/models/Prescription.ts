import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface PrescriptionAttributes {
  id: string;
  patient_id: string;
  doctor_id: string;
  pharmacist_id: string | null;
  medication_name: string;
  drug_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  status: 'pending' | 'dispensed' | 'cancelled' | 'issued';
  notes: string | null;
}

export interface PrescriptionCreationAttributes extends Optional<PrescriptionAttributes, 'id' | 'pharmacist_id' | 'status' | 'notes' | 'drug_name'> {}
export interface PrescriptionInstance extends Model<PrescriptionAttributes, PrescriptionCreationAttributes>, PrescriptionAttributes {}

export const Prescription = sequelize.define<PrescriptionInstance>('Prescription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patient_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  doctor_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  pharmacist_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  medication_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  drug_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ''
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  frequency: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'dispensed', 'cancelled', 'issued'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'prescriptions',
  timestamps: true
});
