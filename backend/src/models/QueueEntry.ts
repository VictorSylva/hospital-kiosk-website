import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

export interface QueueEntryAttributes {
  id: string;
  patient_id: string;
  department_id: string;
  appointment_id: string | null;
  status: 'waiting' | 'called' | 'in-progress' | 'completed';
  queue_number: string;
}

export interface QueueEntryCreationAttributes extends Optional<QueueEntryAttributes, 'id' | 'appointment_id' | 'status'> {}
export interface QueueEntryInstance extends Model<QueueEntryAttributes, QueueEntryCreationAttributes>, QueueEntryAttributes {}

export const QueueEntry = sequelize.define<QueueEntryInstance>('QueueEntry', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  patient_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  department_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  appointment_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('waiting', 'called', 'in-progress', 'completed'),
    defaultValue: 'waiting'
  },
  queue_number: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'queue_entries',
  timestamps: true
});
