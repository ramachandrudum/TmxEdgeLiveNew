const ATTACHMENTS_CSS = `
.center-main { flex: 1; min-height: 0; overflow: auto; }
.assets-hdr { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.assets-hdr h3 { margin: 0; font-size: 15px; font-weight: 700; color: #111827; }
.upload-doc-btn { display: inline-flex; align-items: center; gap: 6px; background: #2563eb; color: #fff; border: none; border-radius: 6px; padding: 7px 13px; font-size: 12px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
.upload-doc-btn:hover { background: #1d4ed8; }
.flat-table { width: 100%; border-collapse: collapse; font-size: 13px; background: #fff; }
.flat-table th { background: #ECF2FA; font-weight: 700; font-size: 12px; color: #4B5563; border: 1px solid #D1E1F5; padding: 7px 10px; text-align: left; white-space: nowrap; }
.flat-table td { border: 1px solid #e5e7eb; padding: 8px 10px; color: #374151; vertical-align: middle; white-space: nowrap; }
.doc-link { color: #2563eb; font-weight: 600; text-decoration: none; cursor: pointer; }
.doc-link:hover { text-decoration: underline; }
.doc-type { display: inline-block; background: #EFF6FF; color: #2563eb; border: 1px solid #dbeafe; border-radius: 999px; padding: 2px 9px; font-size: 11px; font-weight: 600; }
.doc-action-btn { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border: 1px solid #e5e7eb; background: #fff; border-radius: 6px; color: #6b7280; cursor: pointer; transition: all 0.15s; }
.doc-action-btn:hover { background: #f9fafb; color: #374151; border-color: #d1d5db; }
`

export const ATTACHMENTS_HTML = `<div class="center-main" id="centerMain"><div class="fade-in">
    <div class="assets-hdr" style="margin:0 0 12px;">
      <h3>Attachments</h3>
      <button class="upload-doc-btn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 16V4M6 10l6-6 6 6M4 20h16" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        Upload Document
      </button>
    </div>
    <table class="flat-table">
      <thead><tr><th>Document Name</th><th>Type</th><th>Added On</th><th>Added By</th><th>Last Sync</th><th>Action</th></tr></thead>
      <tbody>
    <tr style="cursor:default;">
      <td><a class="doc-link" href="#" onclick="return false;">Centrifugal_Compressor_manual.pdf</a></td>
      <td><span class="doc-type">Technical Manual</span></td>
      <td>24 Oct, 2025</td>
      <td>Priya Iyer</td>
      <td>24 Oct, 2025</td>
      <td>
        <button class="doc-action-btn" title="More actions">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.4"></circle><circle cx="12" cy="12" r="1.4"></circle><circle cx="12" cy="19" r="1.4"></circle></svg>
        </button>
      </td>
    </tr>
    <tr style="cursor:default;">
      <td><a class="doc-link" href="#" onclick="return false;">Maintenance_Logs_2025_Q3.xlsx</a></td>
      <td><span class="doc-type">Report</span></td>
      <td>02 Sep, 2025</td>
      <td>Arjun Mehta</td>
      <td>12 Sep, 2025</td>
      <td>
        <button class="doc-action-btn" title="More actions">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1.4"></circle><circle cx="12" cy="12" r="1.4"></circle><circle cx="12" cy="19" r="1.4"></circle></svg>
        </button>
      </td>
    </tr></tbody>
    </table></div></div>`

export const TAGS_HTML = `<div class="m-[15px] flex flex-col"><div class="flex flex-col"><style>
        .tag-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        .tag-table th.table-content {
          background: #ECF2FA;
          font-weight: 700;
          font-size: 12px;
          color: #4B5563;
          border: 1px solid #D1E1F5;
          padding: 2px 6px;
          text-align: left;
          white-space: nowrap;
        }
        .tag-table td.table-content {
          border: 1px solid #e5e7eb;
          padding: 4px 6px;
          vertical-align: middle;
          background: #fff;
        }
        .tag-table tbody td:nth-child(n+3) {
          text-align: right;
        }
        .tag-cell-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .tag-desc {
          font-weight: 600;
          font-size: 13px;
          color: #111827;
          cursor: pointer;
          line-height: 1.3;
          max-width: 250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .tag-desc:hover {
          color: #2563eb;
          text-decoration: underline;
        }
        .tag-id {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .tag-id-text {
          font-size: 12px;
          color: #6b7280;
          font-family: monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 180px;
        }
        .tag-copy-button {
          display: none;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border: none;
          background: transparent;
          cursor: pointer;
          border-radius: 3px;
          color: #9ca3af;
          flex-shrink: 0;
        }
        .tag-copy-button:hover {
          background: #f3f4f6;
          color: #4b5563;
        }
        .tag-cell-wrapper:hover .tag-copy-button {
          display: inline-flex;
        }
        .last-known-container {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .last-known-value {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .last-known-value span:first-child {
          font-weight: 700;
          font-size: 16px;
          color: #111827;
        }
        .badge-group {
          display: flex;
          gap: 2px;
        }
        .badge {
          width: 16px;
          height: 16px;
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 10px !important;
          font-weight: 800;
          color: #fff !important;
          line-height: 1;
        }
        .badge-success {
          background: #10b981;
        }
        .badge-danger {
          background: #ef4444;
        }
        .badge-warning {
          background: #f59e0b;
        }
        .last-known-timestamp {
          font-size: 10px;
          color: #666;
        }
        .tag-editable-input {
          width: 100%;
          padding: 2px 4px;
          font-size: 12px;
          border: 1px solid transparent;
          border-radius: 3px;
          outline: none;
          color: #374151;
          background: transparent;
          margin-top: 2px;
          text-align: right;
        }
        .tag-editable-input:hover {
          border-color: #d1d5db;
        }
        .tag-editable-input:focus {
          border-color: #3b82f6;
          background: #fff;
        }
        .tag-table thead {
          position: sticky;
          top: 0;
          z-index: 30;
        }
      </style><div class="flex items-center justify-between mb-3 shrink-0 px-1"><h3 class="text-sm font-bold text-gray-900">Tag Management</h3><button class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"></path><path d="M12 5v14"></path></svg>Add tag</button></div><div class="overflow-auto"><table class="tag-table"><thead><tr><th class="table-content" rowspan="2"><div style="display: flex; flex-direction: column; gap: 4px; padding: 2px 0px;"><span style="font-size: 12px; font-weight: 700; color: rgb(75, 85, 99);">Tags (14)</span><input placeholder="Search tags..." type="text" value="" style="width: 100%; padding: 2px 6px; font-size: 11px; border: 1px solid rgb(209, 213, 219); border-radius: 4px; outline: none; font-weight: normal; color: rgb(55, 65, 81); background: rgb(255, 255, 255);"></div></th><th class="table-content">&nbsp;</th><th class="table-content" colspan="4" style="text-align: center;">Alarm Limits</th><th class="table-content" colspan="2" style="text-align: center;">Sensor Range</th></tr><tr><th class="table-content">Last Known</th><th class="table-content">Low low</th><th class="table-content">Low</th><th class="table-content">High</th><th class="table-content">High high</th><th class="table-content">Low</th><th class="table-content">High</th></tr></thead><tbody><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Bfp System-1 Bfp C status</div><div class="tag-id"><span class="tag-id-text" title="state__6499506833bb9c0007588a97">state__6499506833bb9c0007588a97</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">0.000</span><div class="badge-group"><span class="badge badge-danger">B</span><span class="badge badge-danger">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>1 Apr · 3:02 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="-10"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="100"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="120"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="-50"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="150"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">BFP-C BST PMP SUCTION PRESS</div><div class="tag-id"><span class="tag-id-text" title="ORG_2LAB30CP011_XQ01.OUT">ORG_2LAB30CP011_XQ01.OUT</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">0.000</span><div class="badge-group"><span class="badge badge-success">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>1 Apr · 3:02 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="2"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="5"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="25"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="30"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="50"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Motor Winding Temp A</div><div class="tag-id"><span class="tag-id-text" title="ORG_MOT_WND_T_A">ORG_MOT_WND_T_A</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">78.50</span><div class="badge-group"><span class="badge badge-success">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 10:15 AM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="30"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="40"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="95"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="105"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="150"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Deaerator Level</div><div class="tag-id"><span class="tag-id-text" title="ORG_DEA_LVL_01">ORG_DEA_LVL_01</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">850.2</span><div class="badge-group"><span class="badge badge-success">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 11:20 AM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="200"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="400"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="1200"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="1300"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="1500"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Gland Steam Pressure</div><div class="tag-id"><span class="tag-id-text" title="ORG_GLD_STM_PR">ORG_GLD_STM_PR</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">1.25</span><div class="badge-group"><span class="badge badge-danger">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 11:45 AM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0.2"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0.5"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="2.5"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="3.0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="5.0"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Bearing Vibration H</div><div class="tag-id"><span class="tag-id-text" title="ORG_BRG_VIB_H">ORG_BRG_VIB_H</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">4.2</span><div class="badge-group"><span class="badge badge-success">B</span><span class="badge badge-warning">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 12:10 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0.1"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0.5"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="7.0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="9.0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="20"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Fuel Oil Flow</div><div class="tag-id"><span class="tag-id-text" title="ORG_FUEL_FLOW_01">ORG_FUEL_FLOW_01</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">45.8</span><div class="badge-group"><span class="badge badge-success">B</span><span class="badge badge-success">V</span><span class="badge badge-danger">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 12:30 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="10"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="80"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="90"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="100"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Main Steam Temp</div><div class="tag-id"><span class="tag-id-text" title="ORG_MS_TEMP_A">ORG_MS_TEMP_A</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">538.4</span><div class="badge-group"><span class="badge badge-warning">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 1:00 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="480"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="500"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="545"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="555"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="600"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Condenser Vacuum</div><div class="tag-id"><span class="tag-id-text" title="ORG_COND_VAC">ORG_COND_VAC</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">-0.91</span><div class="badge-group"><span class="badge badge-success">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 1:15 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="-0.98"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="-0.95"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="5"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="-1.0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="10"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Lube Oil Temp Outlet</div><div class="tag-id"><span class="tag-id-text" title="ORG_LO_TEMP_OT">ORG_LO_TEMP_OT</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">42.6</span><div class="badge-group"><span class="badge badge-success">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 1:45 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="20"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="30"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="55"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="65"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="100"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Drum Level A</div><div class="tag-id"><span class="tag-id-text" title="ORG_DRM_LVL_A">ORG_DRM_LVL_A</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">5.4</span><div class="badge-group"><span class="badge badge-danger">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 2:05 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="-100"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="-75"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="75"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="100"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="-250"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="250"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Generator Power Output</div><div class="tag-id"><span class="tag-id-text" title="ORG_GEN_MW">ORG_GEN_MW</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="">660.5</span><div class="badge-group"><span class="badge badge-success">B</span><span class="badge badge-success">V</span><span class="badge badge-success">N</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>2 Apr · 2:30 PM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="50"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="100"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="680"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="700"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="800"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">BFP-2A Discharge Pressure</div><div class="tag-id"><span class="tag-id-text" title="ORG_2LAB30CP012_XQ01.OUT">ORG_2LAB30CP012_XQ01.OUT</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="text-gray-500">Offline</span><div class="badge-group"><span class="badge badge-danger">B</span></div></div><div class="last-known-timestamp"><span><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Last update 2 Apr · 10:42 AM</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="30"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="50"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="170"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="180"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="0"></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value="200"></td></tr><tr><td class="table-content"><div class="tag-cell-wrapper"><div class="tag-desc">Condenser Vacuum</div><div class="tag-id"><span class="tag-id-text" title="ORG_CON_VAC_01">ORG_CON_VAC_01</span><button class="tag-copy-button" title="Copy DataTag"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg></button></div></div></td><td class="table-content"><div class="last-known-container"><div class="last-known-value"><span class="text-gray-500">No Value</span><div class="badge-group"><span class="badge badge-danger">B</span></div></div><div class="last-known-timestamp"><span class="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock inline mr-0.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Never updated</span></div></div></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value=""></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value=""></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value=""></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value=""></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value=""></td><td class="table-content"><input placeholder="-" class="tag-editable-input" type="number" value=""></td></tr></tbody></table></div></div>`

export function ProcessFlowPanel() {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <img src="/DCSViews.png" alt="Process Flow" className="block w-full h-auto" />
    </div>
  )
}

export function DashboardPanel() {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <img src="/Dashboard.png" alt="Dashboard" className="block w-full h-auto" />
    </div>
  )
}

export function AttachmentsPanel() {
  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <style dangerouslySetInnerHTML={{ __html: ATTACHMENTS_CSS }} />
      <div dangerouslySetInnerHTML={{ __html: ATTACHMENTS_HTML }} />
    </div>
  )
}

export function TagsPanel() {
  return <div dangerouslySetInnerHTML={{ __html: TAGS_HTML }} />
}
