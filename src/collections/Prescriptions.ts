import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access'

/** Pet + prescription details sent by customers buying prescription-only items. */
export const Prescriptions: CollectionConfig = {
  slug: 'prescriptions',
  labels: { singular: 'Prescription', plural: 'Prescriptions' },
  admin: {
    useAsTitle: 'petName',
    group: 'Customers',
    defaultColumns: ['petName', 'customerEmail', 'status', 'createdAt'],
    description: 'Check each prescription before sending prescription-only items.',
  },
  access: {
    read: staffOnly,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'petName', type: 'text', label: 'Pet name', required: true, admin: { width: '50%' } },
        { name: 'species', type: 'text', label: 'Type of pet', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'ownerName', type: 'text', label: 'Owner name', admin: { width: '50%' } },
        { name: 'customerEmail', type: 'email', label: 'Owner email', admin: { width: '50%' } },
      ],
    },
    { name: 'vetPractice', type: 'text', label: 'Vet practice' },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'prescription-files',
      label: 'Prescription document',
      admin: { description: 'Empty if the customer chose to send it by email or post.' },
    },
    {
      name: 'sendingSeparately',
      type: 'checkbox',
      label: 'Customer will send the prescription by email or post',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Waiting for check', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar', components: { Cell: '@/components/admin/StatusCell#StatusCell' } },
    },
    { name: 'notes', type: 'textarea', label: 'Pharmacy notes', admin: { position: 'sidebar' } },
  ],
}

/** The uploaded prescription files. Only staff can open them. */
export const PrescriptionFiles: CollectionConfig = {
  slug: 'prescription-files',
  labels: { singular: 'Prescription file', plural: 'Prescription files' },
  admin: { group: 'Customers', hidden: true },
  access: {
    read: staffOnly,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [],
  upload: {
    mimeTypes: ['image/*', 'application/pdf'],
  },
}
