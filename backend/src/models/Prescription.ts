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
  route: string | null;
  status: 'pending' | 'dispensed' | 'cancelled' | 'issued';
  issued_at: Date | null;
  notes: string | null;
}

export interface PrescriptionCreationAttributes extends Optional<PrescriptionAttributes, 'id' | 'pharmacist_id' | 'status' | 'notes' | 'drug_name' | 'route' | 'issued_at' | 'medication_name'> {}
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
    allowNull: true // Made optional for creation
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
  route: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'dispensed', 'cancelled', 'issued'),
    defaultValue: 'pending'
  },
  issued_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'prescriptions',
  timestamps: true
});
