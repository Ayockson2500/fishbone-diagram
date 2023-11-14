import React from 'react';
import ReactDOM from 'react-dom/client';

import {
    LiveProvider,
    LiveEditor,
    LiveError,
    LivePreview
} from 'react-live';

import Fishbone from '../src/Fishbone';

import './index.css';

const scope = { Fishbone };


const code = `
    <Fishbone 
        items={{
            "name": "Oil spill from the Hose connected to herald Emmanuel",
            "children": [
                {
                    "name": "Equipment",
                    "children": [
                    { 
                        "name": "Injection to HE was not communicated",
                        "children": [
                            { "name": "No communication"},
                            { "name": "Lack of proper communication"},
                            {"name": "poor design"},
                            {"name": "Unacceptable quality control"},
                            { "name": "Lack of proper communication"},
                            { "name": "No communication"},
                        ]
                    },
                    
                    { 
                        "name": "closed Inlet vale at HE",
                        "children": [
                            {"name": "Insufficient manpower"},
                            {"name": "Poor supervision of equiptment"},
                            {"name": "Switch failure"},
                            {"name": "Switch failure"},
                        ]
                    },
                    { 
                        "name": "Pressurization of Hose",
                        "children": [
                            {"name": "poor design"},
                            {"name": "Unacceptable quality control"},
                        ]
                    },
                    { 
                        "name": "Design envelope exceeded",
                        "children": [
                            {"name": "poor design"},
                            {"name": "Unacceptable quality control"},
                            {"name": "poor design"},
                            {"name": "Unacceptable quality control"},
                            {"name": "poor design"},
                            {"name": "Unacceptable quality control"},
                        ]
                    },
                    {
                        "name": "Hose Damage",
                        "children": [
                         { "name": "Poor maintainace culture"},
                         { "name": "scheduled PM not done"},
                         {"name": "poor design"},
                        {"name": "Unacceptable quality control"}
                        ]
                     },
                    
                     ]
                 },
                 {
                     "name": "Measurement",
                     "children": [
                         {
                            "name": "Override PIT HH to enable pump start-up",
                            "children": [
                                {"name": "Switch failure"},
                                {"name": "PIT p-567A/B/C/D monitors HE & TNP"},
                                {"name": "Untrained replacement for exited panel operators"},
                            ]
                        },
                         {
                            "name": "Pump was set on manuel at the MCC",
                            "children": [
                               {"name": "No one present in the room"},
                               {"name": "No one present in the room"},
                               {"name": "No one present in the room"},
                            ]
                        }, 
                         {
                             "name": "Pump fail to trip on HH pressure",
                             "children": [
                                 {"name": "failure to switch setting from TNP to HE"},
                                 {"name": "PIT p-567A/B/C/D monitors HE & TNP"},
                             ]
                         },
                         {"name": "failure of safety integrated system"},
                     ]
                 },
                 {
                     "name": "Procedure",
                     "children": [
                     {
                         "name": "Quality of SOP",
                         "children": [
                             {"name": "Pre-injecting operations meeting not started",},
                             {"name": "HE and Valve station coms, not clearly started",},
                             {"name": "Channel of communication not clearly defined",}
                         ]
                     },
                     {
                         "name": "SOP not operational",
                         "children": [
                             {
                                 "name": "No communication with valve station guard",
                                 "children": [
                                     {"name": "No radio for valve station guard"},
                                     {
                                        "name": "Coordinating/Supervision errors",
                                        "children": [
                                            {"name": "Supervision errors"},
                                            {"name": "Supervision errors"},
                                            {"name": "Supervision errors"},
                                        ]
                                    },
                                 ]
                             },
                             {
                                 "name": "Required users are not aware of SOP",
                                 "children": [
                                     {"name": "SOP not signed"},
                                     {"name": "Different versions of SOP in circulation"},
                                     {"name": "SOP not at point of Usage"},
                                 ]
                             },
                             {
                                 "name": "No formal training for new joiners",
                                 "children": [
                                     {"name": "No full knowledge of SOP "},
                                     {"name": "Operations actions are instructional based"},
                                 ]
                             },
                             {
                                 "name": "No communication with barges maser",
                                 "children": [
                                     {"name": "Coordinating/Supervision errors"},
                                 ]
                             },
                         ]
                     },
                  
                    
                     {"name": "Meat",
                         "children": [
                         {"name": "Mutton"}
                         ]
                     },
                     {"name": "No following proper procedure",
                         "children": [
                         {"name": "lack of proper training"},
                         {"name": "Inadequate supervision"},
                         {"name": "No one present in the room"},
                         {"name": "Inadequate supervision"},
                         ]
                     },
                     ]
                 },
                 {
                     "name": "People",
                     "children": [
                     {
                         "name": "workload",
                         "children": [
                             {"name": "Insufficient manpower"},
                             {"name": "No formal orientation"},
                             {"name": "No formal training"},
                             {"name": "lack of orientation"},
                         ]
                     },
                     {
                         "name": "Competent issue", 
                         "children": [
                         {"name": "No competency/skill management in place"},
                         {"name": "No formal orientation/training"},
                         {"name": "Limited understanding process control philosophy"},
                         {"name": "Pump override instead of troubleshooting"},
                         {"name": "Poor knowledge of troubleshooting"},
                         
                     ]
                 },
                     {
                         "name": "Fatique",
                         "children": [
                         {"name": "No plant operator shift"},
                         {"name": "Double-tasking(panel and operator)"},
                         ]
                     },
                     {
                         "name": "Competency",
                         "children": [
                             {"name": "No MOC for organizational structure change"},
                             {"name": "Minimum staffing not followed )"},
                             {"name": "Insufficient manpower"},
                             {"name": "Poor supervision"},
                         ]
                     }
                     ]
                 },
                 {
                     "name": "Measurement",
                     "children": [
                     {
                        "name": "Malleability",
                        "children": [
                            {"name": "Malleability"},
                            {"name": "Not following workplace concept"},
                        ]
                    },
                     {"name": "Pump override instead of troubleshooting",
                     "children": [
                        {"name": "No training on pump operation"},
                        {"name": "No proper training"},
                     ]
                    },
                     {"name": "Poor knowledge of troubleshooting"},
                     {
                        "name": "Malleability",
                        "children": [
                            {"name": "No training on operation"},
                            {"name": "No training on fault location"},
                            
                         ]
                     },
                     {
                        "name": "Malleability",
                        "children": [
                            {"name": "No training on operation"},
                            {"name": "Poor supervision"},
                        ]
                    },
                     ]
                 },
                 {
                     "name": "Milieu",
                     "children": [
                     {
                        "name": "Marine materials",
                        "children": [
                            {"name": "sub-standard of materials"},
                            {"name": "Malleability"},
                        ]
                    },
                     {
                        "name": "Malleability",
                        "children": [
                            {"name": "Marine"},
                            {"name": "Malleability"},
                        ]
                    },
                     {"name": "No training on operation"},
                     {
                        "name": "Poor supervision",
                        "children": [
                            {"name": "No supervisor"},
                            {"name": "Malleability of materials during operation"},
                            {"name": "lack of proper supervision"},
                        ]
                    },
                     {
                        "name": "sub standard materials",
                        "children": [
                            {"name": "Malleability of materials during operation"},
                            {"name": "lack of proper supervision"},
                        ]
                    },
                     ]
                 }
             ]
         }} 
         wrapperStyle={{ 
             width: '100%', 
             height: '100%',
             // transform: scale(1.5)
         }} 
     />
 `;

// console.log(code);


const borderPx = 400;
const editorheightPx = 500 - borderPx;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <LiveProvider code={code} scope={scope}>
            {/* <LiveEditor style={{ 
                height: editorheightPx, 
                overflow: 'auto',
                fontSize: '16px',
                whiteSpace: 'pre',
                background: '#322e3c',
                color: 'white',
            }}
            /> */}
            <LiveError />
            <LivePreview style={{ 
                width: '100%', 
                overflow: 'auto', 
                // height: 'calc(100% - 500px)',
                height: '100%',
                borderTop: '1px solid #eee' ,
                
            }} 
            />
        </LiveProvider>
    </React.StrictMode>
);
