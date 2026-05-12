import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

export interface EHRRecordAttributes {
  id: string;
  patient_id: string;
  created_by: string;
  record_type: 'consultation' | 'lab_result' | 'imaging' | 'surgery' | 'discharge';
  content: string;
  is_confidential: boolean;
}

export interface EHRRecordCreationAttributes extends Optional<EHRRecordAttributes, 'id' | 'is_confidential'> {}
export interface EHRRecordInstance extends Model<EHRRecordAttributes, EHRRecordCreationAttributes>, EHRRecordAttributes {}

export const EHRRecord = sequelize.define<EHRRecordInstance>('EHRRecord', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patient_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false
  },
  record_type: {
    type: DataTypes.ENUM('consultation', 'lab_result', 'imaging', 'surgery', 'discharge'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  is_confidential: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'ehr_records',
  timestamps: true
});
