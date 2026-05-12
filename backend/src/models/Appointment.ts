import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface AppointmentAttributes {
  id: string;
  patient_id: string;
  doctor_id: string;
  department_id: string;
  appointment_date: Date;
  scheduled_at: Date | null;
  status: 'booked' | 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';
  reason: string | null;
  notes: string | null;
}

export interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id' | 'status' | 'reason' | 'notes' | 'scheduled_at'> {}
export interface AppointmentInstance extends Model<AppointmentAttributes, AppointmentCreationAttributes>, AppointmentAttributes {}

export const Appointment = sequelize.define<AppointmentInstance>('Appointment', {
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
  department_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  appointment_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  scheduled_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('booked', 'scheduled', 'checked-in', 'in-progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'appointments',
  timestamps: true
});
