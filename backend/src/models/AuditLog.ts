import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.js';

export interface AuditLogAttributes {
  id: string;
  user_id: string | null;
  action: string;
  module: string;
  table_name: string | null;
  record_id: string | null;
  status: string | null;
  details: string | null;
  ip_address: string | null;
}

export interface AuditLogCreationAttributes extends Optional<AuditLogAttributes, 'id' | 'user_id' | 'table_name' | 'record_id' | 'status' | 'details' | 'ip_address'> {}
export interface AuditLogInstance extends Model<AuditLogAttributes, AuditLogCreationAttributes>, AuditLogAttributes {}

export const AuditLog = sequelize.define<AuditLogInstance>('AuditLog', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },
  module: {
    type: DataTypes.STRING,
    allowNull: false
  },
  table_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  record_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'audit_logs',
  timestamps: true,
  updatedAt: false
});
