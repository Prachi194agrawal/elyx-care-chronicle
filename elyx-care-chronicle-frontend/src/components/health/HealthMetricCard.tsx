// import React, { useState } from 'react';
// import { Activity, Calendar, User, Database, TrendingUp, TrendingDown, Minus, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
// // import { HealthMetric } from '../../types';
// // import { format } from 'date-fns';

// // interface HealthMetricCardProps {
// //   metric: HealthMetric & { 
// //     memberName?: string;
// //     memberId?: string;
// //     member?: { name: string; email: string } 
// //   };
// //   showActions?: boolean;
// //   onEdit?: (metric: HealthMetric) => void;
// //   onDelete?: (metric: HealthMetric) => void;
// //   onView?: (metric: HealthMetric) => void;
// // }

// // const HealthMetricCard: React.FC<HealthMetricCardProps> = ({ 
// //   metric, 
// //   showActions = false,
// //   onEdit,
// //   onDelete,
// //   onView 
// // }) => {
// //   const [showMenu, setShowMenu] = useState(false);

// //import React, { useState } from 'react';
// import { HealthMetric } from '../../types';
// import { format } from 'date-fns';


// interface HealthMetricCardProps {
//   metric: HealthMetric & { 
//     memberName?: string;
//     memberId?: string;
//     member?: { name: string; email: string } 
//   };
//   showActions?: boolean;
//   onEdit?: (metric: HealthMetric) => void;
//   onDelete?: (metric: HealthMetric) => void;
//   onView?: (metric: HealthMetric) => void;
// }

// const HealthMetricCard = ({ 
//   metric, 
//   showActions = false,
//   onEdit,
//   onDelete,
//   onView 
// }: HealthMetricCardProps) => {
//   const [showMenu, setShowMenu] = useState(false);
//   const getMetricIcon = (type: string) => {
//     switch (type.toLowerCase()) {
//       case 'weight':
//         return '⚖️';
//       case 'blood_pressure':
//         return '💗';
//       case 'heart_rate':
//         return '💓';
//       case 'blood_sugar':
//         return '🩸';
//       case 'temperature':
//         return '🌡️';
//       case 'steps':
//         return '👟';
//       case 'sleep':
//         return '😴';
//       case 'oxygen_saturation':
//         return '🫁';
//       case 'bmi':
//         return '📏';
//       default:
//         return '📊';
//     }
//   };

//   const getSourceColor = (source: string) => {
//     switch (source.toLowerCase()) {
//       case 'manual':
//         return 'bg-blue-100 text-blue-800 border-blue-200';
//       case 'whoop':
//         return 'bg-red-100 text-red-800 border-red-200';
//       case 'garmin':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'fitbit':
//         return 'bg-purple-100 text-purple-800 border-purple-200';
//       case 'apple_watch':
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//       case 'hospital':
//         return 'bg-indigo-100 text-indigo-800 border-indigo-200';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//     }
//   };

//   const getValueColor = (type: string, value: string) => {
//     const numValue = parseFloat(value);
    
//     switch (type.toLowerCase()) {
//       case 'blood_pressure':
//         // Assuming format like "120/80"
//         const [systolic] = value.split('/').map(Number);
//         if (systolic > 140) return 'text-red-600';
//         if (systolic > 130) return 'text-yellow-600';
//         return 'text-green-600';
      
//       case 'heart_rate':
//         if (numValue > 100 || numValue < 60) return 'text-yellow-600';
//         return 'text-green-600';
      
//       case 'blood_sugar':
//         if (numValue > 140) return 'text-red-600';
//         if (numValue > 100) return 'text-yellow-600';
//         return 'text-green-600';
      
//       case 'temperature':
//         if (numValue > 99.5 || numValue < 97) return 'text-red-600';
//         return 'text-green-600';
      
//       default:
//         return 'text-blue-600';
//     }
//   };
//   const getTrendIcon = (type: string, value: string) => {
//     // This would typically compare with previous values
//     // For now, just showing neutral
//     return <Minus className="w-4 h-4 text-gray-400" />;
//   };

//   function formatMetricType(type: string) {
//         return type
//             .split('_')
//             .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//             .join(' ');
//     }

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-4">
//         <div className="flex items-center">
//           <div className="text-2xl mr-3">{getMetricIcon(metric.type)}</div>
//           <div>
//             <h3 className="font-semibold text-gray-900">
//               {formatMetricType(metric.type)}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {metric.memberName || metric.member?.name || 'Unknown Member'}
//             </p>
//           </div>
//         </div>
        
//         <div className="flex items-center space-x-2">
//           <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSourceColor(metric.source)}`}>
//             {metric.source.replace('_', ' ')}
//           </span>
          
//           {showActions && (
//             <div className="relative">
//               <button
//                 onClick={() => setShowMenu(!showMenu)}
//                 className="p-1 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <MoreVertical className="w-4 h-4 text-gray-400" />
//               </button>
              
//               {showMenu && (
//                 <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
//                   <div className="py-1">
//                     {onView && (
//                       <button
//                         onClick={() => {
//                           onView(metric);
//                           setShowMenu(false);
//                         }}
//                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         <Eye className="w-4 h-4 mr-3" />
//                         View Details
//                       </button>
//                     )}
//                     {onEdit && (
//                       <button
//                         onClick={() => {
//                           onEdit(metric);
//                           setShowMenu(false);
//                         }}
//                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//                       >
//                         <Edit className="w-4 h-4 mr-3" />
//                         Edit Metric
//                       </button>
//                     )}
//                     {onDelete && (
//                       <button
//                         onClick={() => {
//                           onDelete(metric);
//                           setShowMenu(false);
//                         }}
//                         className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                       >
//                         <Trash2 className="w-4 h-4 mr-3" />
//                         Delete Metric
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Value with Trend */}
//       <div className="mb-4">
//         <div className="flex items-center">
//           <span className={`text-3xl font-bold ${getValueColor(metric.type, metric.value)} mr-2`}>
//             {metric.value}
//           </span>
//           <span className="text-lg text-gray-500 mr-3">{metric.unit}</span>
//           {getTrendIcon(metric.type, metric.value)}
//         </div>
//       </div>

//       {/* Metadata */}
//       <div className="space-y-2">
//         <div className="flex items-center text-sm text-gray-600">
//           <Calendar className="w-4 h-4 mr-2" />
//           {format(new Date(metric.timestamp), 'MMM dd, yyyy HH:mm')}
//         </div>
        
//         {(metric.member?.email || metric.memberName) && (
//           <div className="flex items-center text-sm text-gray-600">
//             <User className="w-4 h-4 mr-2" />
//             {metric.member?.email || `Member: ${metric.memberName}`}
//           </div>
//         )}

//         <div className="flex items-center text-sm text-gray-600">
//           <Database className="w-4 h-4 mr-2" />
//           Source: {metric.source.replace('_', ' ')}
//         </div>
//       </div>

//       {/* Health Status Indicator */}
//       <div className="mt-3">
//         <div className="flex items-center justify-between">
//           <span className="text-xs text-gray-500">Health Status:</span>
//           <span className={`text-xs font-medium px-2 py-1 rounded-full ${
//             getValueColor(metric.type, metric.value).includes('red') 
//               ? 'bg-red-100 text-red-700' 
//               : getValueColor(metric.type, metric.value).includes('yellow')
//               ? 'bg-yellow-100 text-yellow-700'
//               : 'bg-green-100 text-green-700'
//           }`}>
//             {getValueColor(metric.type, metric.value).includes('red') 
//               ? 'Needs Attention' 
//               : getValueColor(metric.type, metric.value).includes('yellow')
//               ? 'Monitor'
//               : 'Normal'
//             }
//           </span>
//         </div>
//       </div>

//       {/* Notes */}
//       {metric.notes && (
//         <div className="mt-4 p-3 bg-gray-50 rounded-lg">
//           <p className="text-sm text-gray-700">{metric.notes}</p>
//         </div>
//       )}

//       {/* Click outside to close menu */}
//       {showMenu && (
//         <div 
//           className="fixed inset-0 z-0" 
//           onClick={() => setShowMenu(false)}
//         />
//       )}
//     </div>
//   );
// };

// export default HealthMetricCard;







import React, { useState } from 'react';
import { Calendar, User, Database, Minus, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';
import { HealthMetric } from '../../types';
import { format } from 'date-fns';

interface HealthMetricCardProps {
  metric: HealthMetric & { 
    memberName?: string;
    memberId?: string;
    member?: { name: string; email: string } 
  };
  showActions?: boolean;
  onEdit?: (metric: HealthMetric) => void;
  onDelete?: (metric: HealthMetric) => void;
  onView?: (metric: HealthMetric) => void;
}

const HealthMetricCard = ({ 
  metric, 
  showActions = false,
  onEdit,
  onDelete,
  onView 
}: HealthMetricCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  
  const getMetricIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'weight':
        return '⚖️';
      case 'blood_pressure':
        return '💗';
      case 'heart_rate':
        return '💓';
      case 'blood_sugar':
        return '🩸';
      case 'temperature':
        return '🌡️';
      case 'steps':
        return '👟';
      case 'sleep':
        return '😴';
      case 'oxygen_saturation':
        return '🫁';
      case 'bmi':
        return '📏';
      default:
        return '📊';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'manual':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'whoop':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'garmin':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'fitbit':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'apple_watch':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'hospital':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getValueColor = (type: string, value: string) => {
    const numValue = parseFloat(value);
    
    switch (type.toLowerCase()) {
      case 'blood_pressure':
        const [systolic] = value.split('/').map(Number);
        if (systolic > 140) return 'text-red-600';
        if (systolic > 130) return 'text-yellow-600';
        return 'text-green-600';
      
      case 'heart_rate':
        if (numValue > 100 || numValue < 60) return 'text-yellow-600';
        return 'text-green-600';
      
      case 'blood_sugar':
        if (numValue > 140) return 'text-red-600';
        if (numValue > 100) return 'text-yellow-600';
        return 'text-green-600';
      
      case 'temperature':
        if (numValue > 99.5 || numValue < 97) return 'text-red-600';
        return 'text-green-600';
      
      default:
        return 'text-blue-600';
    }
  };

  const getTrendIcon = (type: string, value: string) => {
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  function formatMetricType(type: string) {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="text-2xl mr-3">{getMetricIcon(metric.type)}</div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {formatMetricType(metric.type)}
            </h3>
            <p className="text-sm text-gray-500">
              {metric.memberName || metric.member?.name || 'Unknown Member'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getSourceColor(metric.source)}`}>
            {metric.source.replace('_', ' ')}
          </span>
          
          {showActions && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <div className="py-1">
                    {onView && (
                      <button
                        onClick={() => {
                          onView(metric);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Eye className="w-4 h-4 mr-3" />
                        View Details
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(metric);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Edit className="w-4 h-4 mr-3" />
                        Edit Metric
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(metric);
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Delete Metric
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Value with Trend */}
      <div className="mb-4">
        <div className="flex items-center">
          <span className={`text-3xl font-bold ${getValueColor(metric.type, metric.value)} mr-2`}>
            {metric.value}
          </span>
          <span className="text-lg text-gray-500 mr-3">{metric.unit}</span>
          {getTrendIcon(metric.type, metric.value)}
        </div>
      </div>

      {/* Metadata */}
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {format(new Date(metric.timestamp), 'MMM dd, yyyy HH:mm')}
        </div>
        
        {(metric.member?.email || metric.memberName) && (
          <div className="flex items-center text-sm text-gray-600">
            <User className="w-4 h-4 mr-2" />
            {metric.member?.email || `Member: ${metric.memberName}`}
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Database className="w-4 h-4 mr-2" />
          Source: {metric.source.replace('_', ' ')}
        </div>
      </div>

      {/* Health Status Indicator */}
      <div className="mt-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Health Status:</span>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            getValueColor(metric.type, metric.value).includes('red') 
              ? 'bg-red-100 text-red-700' 
              : getValueColor(metric.type, metric.value).includes('yellow')
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {getValueColor(metric.type, metric.value).includes('red') 
              ? 'Needs Attention' 
              : getValueColor(metric.type, metric.value).includes('yellow')
              ? 'Monitor'
              : 'Normal'
            }
          </span>
        </div>
      </div>

      {/* Notes */}
      {metric.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">{metric.notes}</p>
        </div>
      )}

      {/* Click outside to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default HealthMetricCard;
