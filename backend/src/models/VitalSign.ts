import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

export interface VitalSignAttributes {
  id: string;
  patient_id: string;
  recorded_by: string;
  weight: number | null;
  height: number | null;
  blood_pressure_systolic: number | null;
  blood_pressure_diastolic: number | null;
  temperature: number | null;
  heart_rate: number | null;
  oxygen_saturation: number | null;
  bmi: number | null;
}

export interface VitalSignCreationAttributes extends Optional<VitalSignAttributes, 'id' | 'weight' | 'height' | 'blood_pressure_systolic' | 'blood_pressure_diastolic' | 'temperature' | 'heart_rate' | 'oxygen_saturation' | 'bmi'> {}
export interface VitalSignInstance extends Model<VitalSignAttributes, VitalSignCreationAttributes>, VitalSignAttributes {}

export const VitalSign = sequelize.define<VitalSignInstance>('VitalSign', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patient_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  recorded_by: {
    type: DataTypes.UUID,
    allowNull: false
  },
  weight: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  height: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  blood_pressure_systolic: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  blood_pressure_diastolic: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  temperature: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true
  },
  heart_rate: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  oxygen_saturation: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bmi: {
    type: DataTypes.DECIMAL(4, 1),
    allowNull: true
  }
}, {
  tableName: 'vital_signs',
  timestamps: true
});
