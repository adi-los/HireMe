import '@servicenow/sdk/global'

declare global {
    namespace Now {
        namespace Internal {
            interface Keys extends KeysRegistry {
                explicit: {
                    acl_application_create_public: {
                        table: 'sys_security_acl'
                        id: 'db8cefe5d9dd41b68cd99305165136c7'
                    }
                    acl_application_final_decision_write: {
                        table: 'sys_security_acl'
                        id: '3da90d460b9b42a78eac4ca3a33bee0f'
                    }
                    acl_application_read_candidate: {
                        table: 'sys_security_acl'
                        id: 'dbc97bd1301d44aab4c094dcfb423757'
                    }
                    acl_application_read_manager: {
                        table: 'sys_security_acl'
                        id: '8b77131122344293b76ee60fe20afbba'
                    }
                    acl_application_read_public_by_token: {
                        table: 'sys_security_acl'
                        id: '78aff9c4a69d4c878d5aa9a98f16ecab'
                    }
                    acl_application_read_recruiter: {
                        table: 'sys_security_acl'
                        id: 'e046643013274d5f91391f1f5a0effef'
                    }
                    acl_application_write_recruiter: {
                        table: 'sys_security_acl'
                        id: '58bd0cb4139c43f4843e980902866d07'
                    }
                    acl_audit_delete_denied: {
                        table: 'sys_security_acl'
                        id: 'ed16cde59f8443b38f418a518a6bc269'
                    }
                    acl_audit_read: {
                        table: 'sys_security_acl'
                        id: '5b7ef2dc9f544daeb581f0d613f63753'
                    }
                    acl_audit_write_denied: {
                        table: 'sys_security_acl'
                        id: '4affbf989a0042fd93b257d524ff102b'
                    }
                    acl_candidate_consent_write_public: {
                        table: 'sys_security_acl'
                        id: 'b8f35eca35b84554966df6d78de47190'
                    }
                    acl_candidate_create_public: {
                        table: 'sys_security_acl'
                        id: '2f14a8214e86434cb9e83acedc81ebc6'
                    }
                    acl_candidate_portal: {
                        table: 'sys_security_acl'
                        id: 'f065b4b0f1434158909f174cca22facd'
                    }
                    acl_candidate_profile_read: {
                        table: 'sys_security_acl'
                        id: '6e0e6a8596f84dda8ea4a08f14bdbb73'
                    }
                    acl_candidate_profile_write: {
                        table: 'sys_security_acl'
                        id: '3aee4ebe598f42c6a5419815a82e28b0'
                    }
                    acl_candidate_read_internal: {
                        table: 'sys_security_acl'
                        id: '9701530b9de743b182eddf534d35c98b'
                    }
                    acl_candidate_read_own: {
                        table: 'sys_security_acl'
                        id: '1a87522298824d15aabb710b38e5ba90'
                    }
                    acl_candidate_write_internal: {
                        table: 'sys_security_acl'
                        id: '0bd2299a02b54b729fdca586265f0add'
                    }
                    acl_chat_interaction_read: {
                        table: 'sys_security_acl'
                        id: '14a151958286420ca8d15cb18382c6fc'
                    }
                    acl_chat_interaction_write: {
                        table: 'sys_security_acl'
                        id: '1bbf74d846924767a19a2ae487b89f88'
                    }
                    acl_cv_document_create_public: {
                        table: 'sys_security_acl'
                        id: '7b9b6b26283745398fe72883cc33f6d6'
                    }
                    acl_cv_document_read: {
                        table: 'sys_security_acl'
                        id: '56b58fd09dc74a418ae537e32c4ca870'
                    }
                    acl_cv_document_write: {
                        table: 'sys_security_acl'
                        id: '1cc0219231674dfea140d2f7bf117293'
                    }
                    acl_interview_read: {
                        table: 'sys_security_acl'
                        id: 'cb0dfd9c62b94406986c31332829d41a'
                    }
                    acl_joboffer_read_internal: {
                        table: 'sys_security_acl'
                        id: '95eaa1522e234a5bada1c56905fc59c0'
                    }
                    acl_joboffer_read_open: {
                        table: 'sys_security_acl'
                        id: '8a0ea2bb9d3e459ab68cf0d45ec21179'
                    }
                    acl_joboffer_write: {
                        table: 'sys_security_acl'
                        id: 'a061ecf89df9418d8a20e2d51bdeaa62'
                    }
                    acl_kpi_snapshot_read: {
                        table: 'sys_security_acl'
                        id: '0ea9b57f0c284855b33a0718a15a6c13'
                    }
                    acl_kpi_snapshot_write: {
                        table: 'sys_security_acl'
                        id: '3ef2d1cabcd3498b9300b00221160c16'
                    }
                    acl_notification_read: {
                        table: 'sys_security_acl'
                        id: '958235c40ed54b3b98b7e2f0863b5790'
                    }
                    acl_notification_write: {
                        table: 'sys_security_acl'
                        id: 'bb36c9313df3458d8fcab3d748d239da'
                    }
                    acl_ocr_webhook: {
                        table: 'sys_security_acl'
                        id: '893b0e0bb49645a08f1c1f8e37d6b008'
                    }
                    acl_scoring_read: {
                        table: 'sys_security_acl'
                        id: '40a4c54d3bd54e66ad63ef37af3665cd'
                    }
                    acl_scoring_write: {
                        table: 'sys_security_acl'
                        id: '91a5b62785604d51a7c18c86aba32f9b'
                    }
                    bom_json: {
                        table: 'sys_module'
                        id: '5991a030901446e89315e30677706207'
                    }
                    br_application_created_audit: {
                        table: 'sys_script'
                        id: 'd982d18b57354e2f9cfe2b55288a6df7'
                    }
                    br_application_decision_audit: {
                        table: 'sys_script'
                        id: 'bfe3dd6b5b9c4c6eb167fe26108f8ad2'
                    }
                    br_application_defaults: {
                        table: 'sys_script'
                        id: '6d9bd9bc313546b98fc4b0c7412a671d'
                    }
                    br_cv_ocr_request: {
                        table: 'sys_script'
                        id: '3d3c92c3239a4a83a7b82a4ecd58d689'
                    }
                    br_cv_ocr_status_change: {
                        table: 'sys_script'
                        id: 'fb6a04272db847c3b17a94a37b50dc6d'
                    }
                    br_interview_invited_at: {
                        table: 'sys_script'
                        id: '12c6679e743a4070b652808a965311d7'
                    }
                    br_interview_status_change: {
                        table: 'sys_script'
                        id: 'f5bc41bd04c94cf8bfba75610cc8eadc'
                    }
                    br_scoring_result_insert: {
                        table: 'sys_script'
                        id: 'e8c99d2ca19e440da3f6a10dfa7829b6'
                    }
                    demo_application_strong: {
                        table: 'x_winu_hireme_application'
                        id: '702f8f686ead40d9b88e683a26e95a81'
                    }
                    demo_application_weak: {
                        table: 'x_winu_hireme_application'
                        id: '92d31d8b4c854bb9ac1ab39781f4c576'
                    }
                    demo_candidate_strong: {
                        table: 'x_winu_hireme_candidate'
                        id: '10762ba7bad5422ba20443dcaf81e764'
                    }
                    demo_candidate_weak: {
                        table: 'x_winu_hireme_candidate'
                        id: 'cfe781afad0e4f12b00d046160cf2883'
                    }
                    demo_cv_strong: {
                        table: 'x_winu_hireme_cv_document'
                        id: 'fdb935fbb95f49c692b19be163ca8e9d'
                    }
                    demo_cv_weak: {
                        table: 'x_winu_hireme_cv_document'
                        id: 'c6c6fca462c34743af4372e5ca62dc96'
                    }
                    demo_job_offer_platform_eng: {
                        table: 'x_winu_hireme_job_offer'
                        id: '04ef9b6c9d0347e59dd2348df2e5d4e1'
                    }
                    demo_profile_strong: {
                        table: 'x_winu_hireme_candidate_profile'
                        id: '107551d612f940b3a7ba4b21bf06bb46'
                    }
                    demo_profile_weak: {
                        table: 'x_winu_hireme_candidate_profile'
                        id: '89f97a4dc4e84b298fe3c6480524f353'
                    }
                    demo_scoring_strong: {
                        table: 'x_winu_hireme_scoring_result'
                        id: '9ee41f76f81a49609d20973cbf51d456'
                    }
                    demo_scoring_weak: {
                        table: 'x_winu_hireme_scoring_result'
                        id: '900429da0bb64c40aec6380392ff5c20'
                    }
                    demo_user_candidate: {
                        table: 'sys_user'
                        id: '570ca67f7cba4f969af29474c9d6f8a2'
                    }
                    demo_user_candidate_role: {
                        table: 'sys_user_has_role'
                        id: 'bd1de8c4aa114c588cad093fcfe799fc'
                    }
                    demo_user_hiring_manager: {
                        table: 'sys_user'
                        id: '14163567cb4446198c04fc03b43e4a14'
                    }
                    demo_user_hiring_manager_role: {
                        table: 'sys_user_has_role'
                        id: '9e65ecf38d35497fb69c9bbe5e886128'
                    }
                    demo_user_recruiter: {
                        table: 'sys_user'
                        id: '0e3c92b35b6c49d7a04a64cebf74da12'
                    }
                    demo_user_recruiter_role: {
                        table: 'sys_user_has_role'
                        id: '6ae5b61532db4478b2d07f0cc315400e'
                    }
                    job_kpi_aggregation: {
                        table: 'sysauto_script'
                        id: '1296f1c184c04f0a8cbd22daead26a4b'
                    }
                    job_retention_anonymization: {
                        table: 'sysauto_script'
                        id: '563a46e8c59847d9a99aaaade8964ff9'
                    }
                    menu_hireme: {
                        table: 'sys_app_application'
                        id: '229d74e71a54479aa99995bc303d6c5c'
                    }
                    module_applications: {
                        table: 'sys_app_module'
                        id: '41d482d964054b1ab55235dbf00888d2'
                    }
                    module_audit_log: {
                        table: 'sys_app_module'
                        id: '657b8be77eca4837828d32111176ee98'
                    }
                    module_candidates: {
                        table: 'sys_app_module'
                        id: '8cd62c1ccc564922a6a6ed2f7c6c9536'
                    }
                    module_chat: {
                        table: 'sys_app_module'
                        id: 'd9fae48611dd49e583e3af8ef81f443e'
                    }
                    module_cv_documents: {
                        table: 'sys_app_module'
                        id: '4f388df03fa4446289fc3cc09f1a8afd'
                    }
                    module_interviews: {
                        table: 'sys_app_module'
                        id: '1c88a6c5501b419f8058d363c3becab5'
                    }
                    module_job_offer_new: {
                        table: 'sys_app_module'
                        id: '816812702949439f8ec09205f31df4cf'
                    }
                    module_job_offers: {
                        table: 'sys_app_module'
                        id: 'f10aaa425f874e02b9e4837745a327ab'
                    }
                    module_kpi: {
                        table: 'sys_app_module'
                        id: 'ae8a10a4eccd47ac89b7740db4c520ee'
                    }
                    module_notifications: {
                        table: 'sys_app_module'
                        id: 'a1e7221b82724e2ba47bc36da2e15951'
                    }
                    module_ocr_failures: {
                        table: 'sys_app_module'
                        id: '7961d236dbab41129c44f5787a7ffb47'
                    }
                    module_profiles: {
                        table: 'sys_app_module'
                        id: 'd09e1c13dd074f6d8eedf67fd49ddefd'
                    }
                    module_review_queue: {
                        table: 'sys_app_module'
                        id: '850d7855c88b43e0ac63a9925a875e56'
                    }
                    module_scoring_results: {
                        table: 'sys_app_module'
                        id: '695dd45ff1c6480182320dc5642353b8'
                    }
                    module_sep_admin: {
                        table: 'sys_app_module'
                        id: '18d4171d6ec64ffe928dba2c3bd4b20e'
                    }
                    module_sep_ai: {
                        table: 'sys_app_module'
                        id: 'bb67c7b129364861a61534500465b5d2'
                    }
                    package_json: {
                        table: 'sys_module'
                        id: '4b2140de9ca046d49dedf321d85a022c'
                    }
                    prop_auto_reject_enabled: {
                        table: 'sys_properties'
                        id: '07631fad1bee4cea86437d126fad4b59'
                    }
                    prop_interview_auto_top_match: {
                        table: 'sys_properties'
                        id: '0baa834df9a045db80b5bde37f5f2ee1'
                    }
                    prop_ocr_callback_token: {
                        table: 'sys_properties'
                        id: '0ae3133e8ea149adb10ea9715d6362f0'
                    }
                    prop_ocr_enabled: {
                        table: 'sys_properties'
                        id: '0df78709f61d409d837ebbc9eba0e96b'
                    }
                    prop_ocr_endpoint: {
                        table: 'sys_properties'
                        id: 'c84f05120ec94f569f321bed89ab3955'
                    }
                    prop_ocr_sla_minutes: {
                        table: 'sys_properties'
                        id: '8376280633be4e0d9de0dfc2a3fb4157'
                    }
                    prop_retention_months: {
                        table: 'sys_properties'
                        id: '426b18c13d5f411cb2e14ba19b7667aa'
                    }
                    prop_scoring_model_version: {
                        table: 'sys_properties'
                        id: 'd721931152b64b3e8ee4951520eaf44e'
                    }
                    prop_scoring_normalize: {
                        table: 'sys_properties'
                        id: 'd474d8c3f09541c480f1f4b7246bfa9a'
                    }
                    prop_scoring_use_llm: {
                        table: 'sys_properties'
                        id: 'f44f868ba3e34103ae1edfa647a8e83e'
                    }
                    prop_scoring_weights: {
                        table: 'sys_properties'
                        id: 'd84ea2e646ad43cc8ed0682bc969553e'
                    }
                    restapi_candidate_portal: {
                        table: 'sys_ws_definition'
                        id: '09ee352e6f064ddb8ef553f701130163'
                    }
                    restapi_ocr_webhook: {
                        table: 'sys_ws_definition'
                        id: 'e7b0ef76ef1c4fe98f295bda23fb4bcf'
                    }
                    restapi_ocr_webhook_callback: {
                        table: 'sys_ws_operation'
                        id: 'e8063a43f29d4d44b2adccecf03d0f26'
                    }
                    restapi_portal_apply: {
                        table: 'sys_ws_operation'
                        id: 'd2489ea06ecd44f3ab6254df7633a614'
                    }
                    restapi_portal_interest: {
                        table: 'sys_ws_operation'
                        id: '859e8601072243bf8098278fea60db5a'
                    }
                    restapi_portal_status: {
                        table: 'sys_ws_operation'
                        id: '6642d437241d4b30a8f7f41a359d899e'
                    }
                    restmsg_ocr_extract_hdr_cb: {
                        table: 'sys_rest_message_fn_headers'
                        id: 'b412084e92824c869280f72b5cb0936c'
                    }
                    restmsg_ocr_extract_hdr_ct: {
                        table: 'sys_rest_message_fn_headers'
                        id: 'b27b0918da644945aeaa49f955301542'
                    }
                    restmsg_ocr_service: {
                        table: 'sys_rest_message'
                        id: 'b344ebaabd3447e8ad8ab4fe0cbadf43'
                    }
                    restmsg_ocr_var_base: {
                        table: 'sys_rest_message_fn_parameters'
                        id: '542898ca7c6e433e904739bfbf173a6c'
                    }
                    restmsg_ocr_var_payload: {
                        table: 'sys_rest_message_fn_parameters'
                        id: 'ae5a8253dbcb4814b2cad89012adbd21'
                    }
                    restmsg_ocr_var_token: {
                        table: 'sys_rest_message_fn_parameters'
                        id: 'e4bdbd13d5ac4a42b1364b0b127e9c77'
                    }
                    'src_server_business-rules_application-defaults_js': {
                        table: 'sys_module'
                        id: '206f8b7baae243dd88920f10bff6aeea'
                    }
                    'src_server_business-rules_audit-application_js': {
                        table: 'sys_module'
                        id: 'f73880b8768f4e839bbc05e77fc4c4ab'
                    }
                    'src_server_business-rules_cv-document_js': {
                        table: 'sys_module'
                        id: '17a980df2b9f409fbd97b72581fe47ce'
                    }
                    'src_server_business-rules_interview-session_js': {
                        table: 'sys_module'
                        id: 'c5f024611e274ed888eea1c571cde0b4'
                    }
                    'src_server_business-rules_scoring-result_js': {
                        table: 'sys_module'
                        id: '726a7de23ddd461b93bc690b94757eb8'
                    }
                    src_server_glide_audit_js: {
                        table: 'sys_module'
                        id: 'ac1d62455e474545af465fc2b9f4a09b'
                    }
                    src_server_glide_config_js: {
                        table: 'sys_module'
                        id: '21b64376e62447bb88ca228be3901865'
                    }
                    src_server_glide_intake_js: {
                        table: 'sys_module'
                        id: 'e8906a940b8f47d7b86895977543965a'
                    }
                    src_server_glide_ocr_js: {
                        table: 'sys_module'
                        id: '66565729d56a494eb42d8702b57bbfcf'
                    }
                    src_server_glide_pipeline_js: {
                        table: 'sys_module'
                        id: '0849b911a89044e5b9e048d92ebcfdff'
                    }
                    'src_server_jobs_kpi-aggregation_js': {
                        table: 'sys_module'
                        id: 'b3f3dd3db7f34279b98755ea8549f273'
                    }
                    src_server_jobs_retention_js: {
                        table: 'sys_module'
                        id: '18f3b623cc8c422eb0e5ac322a0e5b4e'
                    }
                    src_server_matching_js: {
                        table: 'sys_module'
                        id: '6f109b84787340a7860b4f3d3fe7af24'
                    }
                    'src_server_profile-parser_js': {
                        table: 'sys_module'
                        id: '2e2a83ee3136494cb59101d0a0ed8a3e'
                    }
                    'src_server_rest_candidate-portal_js': {
                        table: 'sys_module'
                        id: 'b2f0a0e822c44617aab0c0ca20137c62'
                    }
                    'src_server_rest_ocr-callback_js': {
                        table: 'sys_module'
                        id: '5e856093322844828b8457009d85d94b'
                    }
                    src_server_scoring_js: {
                        table: 'sys_module'
                        id: '89eae49da96544e5a31f8c2c9e7919e0'
                    }
                }
                composite: [
                    {
                        table: 'sys_documentation'
                        id: '008ab5a98b484c77919e50c5d7e19bc0'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'experience_years'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '00a71e032c23404eb9d43a5cfc848292'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'reason'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '01621851ff6647998e25aefb11bac949'
                        key: {
                            name: 'x_winu_hireme.admin'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '023e6fa0ec28470fa58ba5fdeb63ec20'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'past_roles'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '0515897e299b45048a71f6c9c15eead2'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '06a59584c6e24205844d9da8a7b40340'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'actor'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '06d73b527c6c45ba9b091b252f1c8c5b'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '07896a7d3bfd49f8b39bac31f3837992'
                        key: {
                            sys_security_acl: '6e0e6a8596f84dda8ea4a08f14bdbb73'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '080fa48a36814d9b8f3b93f0e61f5114'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'scope'
                            value: 'joboffer'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '08a2973526c142cebb250b0d5bf875fc'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'actor_type'
                            value: 'user'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0a33b830552a4adebea94266f5318c31'
                        key: {
                            sys_security_acl: 'cb0dfd9c62b94406986c31332829d41a'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0a7b4c650a3d4c4481b304f62abac4e5'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'scope'
                            value: 'global'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0ac0a000c2694f9ea8da090bc4136b8d'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '0afb344e893c452cbc6211e7943417ff'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0b31af980be64a15b3cba661fe8a26bf'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'final_decision'
                            value: 'rejected'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '0bb82203670742c19580ac5e6ffdd10f'
                        key: {
                            name: 'x_winu_hireme_candidate'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '0bd3f2e4d4f44929a2be91809cbe28a5'
                        key: {
                            sys_security_acl: '1bbf74d846924767a19a2ae487b89f88'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '0be65a5562914574849ef01d7420eec6'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '0e5e5033075b486b91b4cbbc7bbadd90'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'status'
                            value: 'draft'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '0e705ce4adfb4b61ba36a262227b2b4f'
                        key: {
                            name: 'x_winu_hireme.integration'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '0f396fbc42214ccca4e5bd1f3bf03a8b'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'transcript'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '0f792cb9062c4dee889777fde413c114'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'scope'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1259614e9e034b0f96874667934cf4d2'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_status'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '12898a08458348b4a99e7148d5998451'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'model_version'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '12b8bebe9a8d4342b61b416b4850fdb9'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '12c9b6cebff54191a331751171d8d068'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'status'
                            value: 'closed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '13684dd9ff214b14b8f4b74f986d95b3'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'final_decision'
                            value: 'withdrawn'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '13bda45e084b4985ab4618af36262428'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'past_roles'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '14827ace0d84466fb2703489a8234cdf'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1572a178afd842a0a8413d21a7520e38'
                        key: {
                            sys_security_acl: '5b7ef2dc9f544daeb581f0d613f63753'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '157358a4c68d406391a7d154cd338732'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '15e8938995554a929bd84207c4d8993c'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'captured_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '162e232f042449ca946bb9b57bc88ee1'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'details'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '164fc86635c74806903ffef2605303ec'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'full_name'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '17247c5547e54a6f96451731c89570a3'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'email'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '17cedbb6158c46288366342555ddb3a6'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'status'
                            value: 'interviewing'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '19642694b11946469b27f6c5ea92158b'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'flags'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1b0c624d4a8e4c3696f1f5f4bdef3c16'
                        key: {
                            sys_security_acl: '958235c40ed54b3b98b7e2f0863b5790'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1bec773d2b9d4943af0961230c8c920c'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'applied_date'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1c1c9849d4b7486ab0b5d227e56f64fd'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '1c47164bb00548cdb63fb03228f9bf4b'
                        key: {
                            sys_security_acl: '14a151958286420ca8d15cb18382c6fc'
                            sys_user_role: {
                                id: '8287635526004c119ca1001fdc713f62'
                                key: {
                                    name: 'x_winu_hireme.hiring_manager'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1c688508ec304576b1620bf24bf9aca6'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'application_ref'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1e07a1c884a0467c972779a79bc7755d'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'channel'
                            value: 'email'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '1f18f2ec6aea422b8fcb90ddfcc31631'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'actor_type'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1f85555ec03147969844e5474d3784c1'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'category'
                            value: 'strong_fit'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '1f95dab77a514589876d636d3d37219a'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '1faf170495e74a758d84592d9e8f7ac7'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'status'
                            value: 'screened'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '1fb8e820836d48f6be2fcb874dbb1bc8'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'applications_decided'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2052ebbf06d0439a92bc693d622a2d26'
                        key: {
                            sys_security_acl: '9701530b9de743b182eddf534d35c98b'
                            sys_user_role: {
                                id: '8287635526004c119ca1001fdc713f62'
                                key: {
                                    name: 'x_winu_hireme.hiring_manager'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '21c9cb9eb7c14be5a88f5e1ae4f9b34b'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '22740f51713e456184f6e50b8f3a9ba3'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'source'
                            value: 'agency'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '229561febcdc4e6da04cb76b88d15890'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'action'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '22b412292bd044eaa6e25d598347ca92'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'data_confidence'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '272573350e044543ab57cce73cd9ff1e'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '27ae42e2ddd14516a994a5cdd40bd97e'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'flags'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2856257021cf430bba7bff931095699b'
                        key: {
                            sys_security_acl: '40a4c54d3bd54e66ad63ef37af3665cd'
                            sys_user_role: {
                                id: '8287635526004c119ca1001fdc713f62'
                                key: {
                                    name: 'x_winu_hireme.hiring_manager'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_number'
                        id: '28744524404941f9ad96efdd421be274'
                        key: {
                            category: 'x_winu_hireme_application'
                            prefix: 'HIRE'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '2979a2caae024eb6a29296366b6c50cb'
                        key: {
                            sys_security_acl: '95eaa1522e234a5bada1c56905fc59c0'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '29d95308467d4bd590e8b5b4d455680e'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'channel'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '29d99ca1283f475998a64830f729020a'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'actor_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2a1c494488724352aed9c16c1e123c0a'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '2bfcd78cf34c44f1bfaaf7c02cf5a855'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2ced6864fee240359d24ba66c7585b96'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'phone'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2d3858e801b54a9d93b7b1bb03951165'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'application_ref'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '2ee8ca8c10064129985f8b18e99c7677'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'file_name'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2f111bf37b8040238604a39f22a1c9c4'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'status'
                            value: 'failed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '2f799a91063c444dadfb953e78562751'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'is_current'
                            value: 'false'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '2f7fc14b0c76459498c7f6b8b868a43e'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'sent_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '30adde27ca6f482483e978b08880b1a1'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'number'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3116ce9d9183436d870f7009c0206a12'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'transcript'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '311e9e8904b9473c9767bd0edff5e8f3'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'experience_years'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '322ad8edcced4b0ab6dffd3664d13292'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '32498fd1ddd840baa1e271c50174df1a'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'status'
                            value: 'on_hold'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '32642aff3542425f9bd86638e372f600'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'consent_given_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '365e419b765245e6a04fc2595d99b971'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'reviewed_by'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '36c33e507e674b5f8e15f5c939b1dcad'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'channel'
                            value: 'slack'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '36f4b0f8a93d4669bca7a51335811aed'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '383042e88f7a40e19b3d8cc7da2d24ea'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'invited_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '3835909f20ac4df4b5590a76d58b9008'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'status'
                            value: 'reviewed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '38606a4ec6494c90b09811d708b8cdc1'
                        key: {
                            sys_security_acl: '58bd0cb4139c43f4843e980902866d07'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '39f7da39cdf04b07a8137e864d9743fb'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3a6ad20dc5c2429693c178c7a5ead2e5'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'scope'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3ac642f4d6694f399036350b721c2440'
                        key: {
                            sys_security_acl: '9701530b9de743b182eddf534d35c98b'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '3c12f78e8d5648e1a892f1da76173b3a'
                        key: {
                            sys_security_acl: 'cb0dfd9c62b94406986c31332829d41a'
                            sys_user_role: {
                                id: '8287635526004c119ca1001fdc713f62'
                                key: {
                                    name: 'x_winu_hireme.hiring_manager'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3d35b7c6bf3844bfa232579c40408b43'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'department'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3d3ded144c6948488eff74dff98333bb'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'reason'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3d6cc671e247463cb0f8c34fd29fc93a'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'candidate_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '3e952c76d3454422a09f33720b79425a'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '3f5099cc7c2f4516b4d59b582a4be374'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'application_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '406e075ff3a841a39e805bbc931476db'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'auto_interview_enabled'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '428a3e94a9e54e8aa94125171baa2de9'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_error'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '448b88dca0954e868c99a9c2cab9232e'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'actor_type'
                            value: 'system'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '44a62f2cc0ba4d06b42158a0fc385a4c'
                        key: {
                            name: 'x_winu_hireme.candidate'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '46daea8c49114523a5bd22294bc56065'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'status'
                            value: 'invited'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '480573c4b6b04c829cb7765962104515'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'category_distribution'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '48db2378e50b4b74aba581eecd32264f'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'message'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '4c69f954c53443d59ff1a1d8d5de3766'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '4c76468d225549d696b8cc67a8f301e9'
                        key: {
                            name: 'x_winu_hireme_notification'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4cd54b2e334647bcb09b25da00527dff'
                        key: {
                            sys_security_acl: 'e046643013274d5f91391f1f5a0effef'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '4da8a0fa092f403489637f1023719d20'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '4e4b1bda79ca45538ed5f37dfbd6b639'
                        key: {
                            sys_security_acl: '95eaa1522e234a5bada1c56905fc59c0'
                            sys_user_role: {
                                id: '8287635526004c119ca1001fdc713f62'
                                key: {
                                    name: 'x_winu_hireme.hiring_manager'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '4ef0e20547114d648be9a1ebdee7b144'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'location'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '51694bdbda6a4478996f941c3b90fe31'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'channel'
                            value: 'portal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5177e33d96484a318fe2c22e73338da0'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'mime_type'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '523da723fa0d4342925950da639dbc3a'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5242c47aaa94468593ba4a6e5fc0c23f'
                        key: {
                            sys_security_acl: '1a87522298824d15aabb710b38e5ba90'
                            sys_user_role: {
                                id: '44a62f2cc0ba4d06b42158a0fc385a4c'
                                key: {
                                    name: 'x_winu_hireme.candidate'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '55e23a84a7cf4a1cb5691333d2ab52a3'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'application_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5663467643a84fd0818d1b53d6bbaf02'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'education'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '56b2d2d577f943d3bf60a2da40856fb9'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'channel'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '570c44e7f58847cb856a3a6dce716180'
                        key: {
                            sys_security_acl: '40a4c54d3bd54e66ad63ef37af3665cd'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '58202fa7396844e58ce5c62ad3329b20'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'joboffer_ref'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '584ad1573af343f08430a737b10afda8'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'scored_at'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5adf13a3d9ec462f88392d48bfa56ee5'
                        key: {
                            sys_security_acl: '0bd2299a02b54b729fdca586265f0add'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5b72481c232444a6b48d8f4128fe16a1'
                        key: {
                            sys_security_acl: '3aee4ebe598f42c6a5419815a82e28b0'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5c359f7615bc42f8b3af939ad4f7c784'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'template'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5c36e2567c954e6bb0bd04101e8d99cd'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'avg_time_to_hire_days'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5de54a5e27c24e01a071195743333a0a'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'channel'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '5f7575b4dd614e458baa9070406e41ba'
                        key: {
                            sys_security_acl: '56b58fd09dc74a418ae537e32c4ca870'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '5f8a8c1260344ab18f8509d02e9a7e6b'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '5fc73f7df63842a3be3a5dcb2dd93797'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'timestamp'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '60202063a837439c84c583ea7dcb8836'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'applications_total'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '603bd9102d204b6a8a9036a21a8fe725'
                        key: {
                            name: 'x_winu_hireme_application'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6051bfa5a2984c23bbfbe257c453cd70'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'breakdown_json'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '607b9fee9b8d42dcb3134d9fd5d11891'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'timestamp'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6170e7dab35b4018964070a36c8920e0'
                        key: {
                            sys_security_acl: '40a4c54d3bd54e66ad63ef37af3665cd'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '63c2e6ecab994211b42b5027b524847b'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'access_token'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '63edc62bf96e4bf9881462829495568a'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'timestamp'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6561fafbe30c4ec8aca07a188af2fa7d'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'breakdown_json'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '663bae54d8ad45bf97b6356eb2d438bd'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'application_ref'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6816e2593ae046039449835d592ad497'
                        key: {
                            sys_security_acl: 'e046643013274d5f91391f1f5a0effef'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '682f3551bd5b46a3b77577c7002410f8'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'source'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '689065b2b84d46118259107a24d08d1e'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '68c498fd95514d35b0c73841898b9ce6'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'score'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '68dd645dfc7b4192ae4d8eac19597976'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'application_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '691ba444e66647bdbfd2eb59fe4da8d4'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'description'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6afd040adf00441ebd8db23b1a00ae84'
                        key: {
                            sys_security_acl: '958235c40ed54b3b98b7e2f0863b5790'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6b7632a51e78493f9462745d73b1ebf2'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'access_token'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6bbffe4738cd4a3b87feea461db38dfb'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'completed_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '6bdb54cb90214100a360664330a08123'
                        key: {
                            sys_security_acl: 'a061ecf89df9418d8a20e2d51bdeaa62'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6d1d348768e24aaebe828dcedbaca1e0'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'raw_text'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '6d67ff316e014d998ac41fcfaa2a1cb5'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'final_decision'
                            value: 'accepted'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '6d74277f7df149628428dfb472479639'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6d8daebc154a4586957f23fb8774ffdf'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'citations'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '6df6cdc18d854f55bd892da56900f569'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '6e14e5b4252946419b02079d30117f09'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'application_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '70bc1aee6a8840babed2e60637934b36'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'is_current'
                            value: 'true'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '73704b17a5d64030b1fd1e0321a5f6b9'
                        key: {
                            sys_security_acl: '58bd0cb4139c43f4843e980902866d07'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '74645ad982bb466c914c60b140fac1bd'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'role'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '74a3e578053c4f50a91f7dfa57d139fe'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'assigned_recruiter'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '74dc4feda7b847d79cee7b3c0f81c9c9'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'joboffer_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '774238fa570a4c199bd09001b0eb9388'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7943448653a64704a6127e9cab297945'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'applied_date'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '7a2ed73fa3e84af1a1850ec07e0340c8'
                        key: {
                            sys_security_acl: '14a151958286420ca8d15cb18382c6fc'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7c43befd7bdd495ea67087015f6c0aa0'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'joboffer_ref'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7c6d42b64ae14a2796ad8768fc7b9643'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7c84284a97024acf9ba8d609fc9c22c6'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'template'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '7d43c6fb783341aa896f57c040632bad'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'raw_text'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7d8e8a8c5a684f7e905daedd58ab221f'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_status'
                            value: 'failed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '7dde30dc47df412a95d5aba39e8da81a'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'channel'
                            value: 'candidate_va'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '7e4aa091389f4ba8a84fadae693440e6'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'interview_completion_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '7ff3a53dbc6842548185cc71b07aad5b'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'channel'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8008acb341814fe28dbd1d049bbc39b6'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'candidate_ref'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8202988d0bf94fcb96c8deec6e6e9dad'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'ai_subscore'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: '82720638c6f14cafb6001539fedd25ce'
                        key: {
                            name: 'x_winu_hireme_candidate'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '827f0ef22776462c81ca4df7d0a575f3'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'role'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: '8287635526004c119ca1001fdc713f62'
                        key: {
                            name: 'x_winu_hireme.hiring_manager'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: '829240b14ee54e3e8db0264ae5e3e922'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8294348d340f434da45c895044005f18'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'ocr_success_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '82c1b0d9312940ef853910f30ee00c63'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'category'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '838691aa13c7411f8a953c6244ee6a4a'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'final_decision'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8436cd663f574f60a470d5c3811724a3'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'status'
                            value: 'received'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '84604da875a04b459043a7dd3368eb31'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'phone'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '848dc63f90f04e8aaa850ca720e0e11e'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'application_ref'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '86105e59dca9421b84bd35f6e7cc2db6'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'source'
                            value: 'career_fair'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '866b402deea445c694c9d7e1e547bf54'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'consent_given_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '875c603de9174f4591b5be25fd1e0797'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'location'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '87704115e144459db03caf9e92413ec7'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'actor'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '87b6a42145934578aa533107d2a46ba8'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'number'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: '87f8db5549334f68b80d94dd0e1aa30d'
                        key: {
                            sys_security_acl: '6e0e6a8596f84dda8ea4a08f14bdbb73'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8963879f07554719b6c68381503d6201'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'auto_interview_enabled'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '89fcd6509ae348cfad89cf63bdbafbe3'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'email'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '8a83f3ee45ca443e90e05e84052b436b'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'source'
                            value: 'referral'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8b091dc7c4cd42ef8f7c292c00972e2b'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'description'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8c2e96bea4ae46288cf396c404256867'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'captured_at'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '8cf5f046662744d7af4230b73b6e19a7'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'source'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '8d1c5c01a0c44229ba33cb671710af2c'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'is_current'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8d6b52f718324ebb9eb0f5f01ad2ab39'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'action'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '8dff53727ada4c0090b33a92a377b062'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'application_ref'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '8f269d570bcd4628966e9fb35841b482'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'model_version'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: '8f2be1baa34b40ef89cfe874ad4e22fc'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'category'
                        }
                    },
                    {
                        table: 'sys_rest_message_fn'
                        id: '902e5080a8b24edab2fc8ba8acf01901'
                        key: {
                            rest_message: 'b344ebaabd3447e8ad8ab4fe0cbadf43'
                            function_name: 'extract'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '931a3765b0a54f97b9fc2b5a05b5e895'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'requirements'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '95f8a6850338407c91e8c922300e7435'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'applications_decided'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9793662a8b44499a913f5a067cf4ae9f'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'source'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '97d4a56957a0496da632f3ca53da079f'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'status'
                            value: 'sent'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '981c9339777d4da48b45117c7b2af640'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'mime_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9857ae318d9f44b8b686394be1214f01'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'actor_type'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '98878de750b04fb5bb7e91d16e8ba44a'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'joboffer_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '997c6261c92a4d409137661c8c1cddaf'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'skills'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: '9b592c9c713d4327838fb97ce3a11ceb'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'role'
                            value: 'user'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: '9f774e8c8302404a9365bacb8d0c37db'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'application_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: '9f9d28df33074c808c0f837371ad6444'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'department'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'a04213953e944ff99527d11115c286ab'
                        key: {
                            sys_security_acl: 'dbc97bd1301d44aab4c094dcfb423757'
                            sys_user_role: {
                                id: '44a62f2cc0ba4d06b42158a0fc385a4c'
                                key: {
                                    name: 'x_winu_hireme.candidate'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a0cbd459cd204a968cd43196c68b3fee'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'is_current'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a12b54bf3ba04ed7a4702d929b19612b'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'a167c782757143b18bc9ed1ade06c0eb'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a1960ce565214a628a82808e3450ca71'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'application_ref'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'a35f833829044a4185f20f070825f2c3'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'final_decision'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'a4602b77d7ee435e885b205e011abd62'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'applications_scored'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a6b8eb4fcc524a62a34faf5ebe8a3210'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_completed_at'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'a6fd7cdd89e44d349e8a7324e4f9ff78'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'offer_conversion_rate'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'a92c8a2da55c4780ba416bcfc646b774'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'aa245dc03526433fb2281dfa4926b04f'
                        key: {
                            sys_security_acl: '95eaa1522e234a5bada1c56905fc59c0'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ab3297242d7345b798deafb84c5a8cf4'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'parser_version'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ad9ed77d0fd044048a46d052284b93fd'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'applications_scored'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'afd10c48e486456e94d47a84a627f42c'
                        key: {
                            sys_security_acl: '0bd2299a02b54b729fdca586265f0add'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b11cc85d5ef643c38e0d3a231399f907'
                        key: {
                            sys_security_acl: '56b58fd09dc74a418ae537e32c4ca870'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b273a0c8663e4aeb8294d29c888a5eff'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_status'
                            value: 'complete'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b28593729f8c4d03b363dd5f398d633e'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'completed_at'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b3f1142e8f2945979a49eb05515edcca'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'assigned_recruiter'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'b48ce3d6b59c4ea6874e158717717f0f'
                        key: {
                            sys_security_acl: '91a5b62785604d51a7c18c86aba32f9b'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b5daf448b208400f9e40936f31acfb96'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'score_variance'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b6863da1d06742cd8cc980fff764c53c'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'education'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'b7bc329fd1994e99a91d1a011589c3d9'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'citations'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'b8a5a95191694b28811b859d99f72dc4'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'source'
                            value: 'portal'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b8c5768b9ee94943b6f91c4c5fdcb927'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'b8f6b121244f4e64a4f1950c392ef332'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'channel'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'baba162ec77442f18cc265f67173a23c'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'baf875d1c9c2415db5988c57ea49c77c'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'sla_compliance_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bb022bb0addb49fc86b066d99fa2e1a1'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bb9a336c1ff042f5accd9326feef52be'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc39d5d43336447f8b2980cdd09d8eb7'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'status'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bc960d22c1d4401693939bbee3e8d92e'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'avg_time_to_screen_hours'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'bc9f261c31c042f8854f3bd4f4e6ade8'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'full_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bca8d0856b5248c2997f38b62bb8ace2'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'bf834ad9d3e54cb58e9ba52b63bc7ab0'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'error'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c0ebb0e13b704d66ae749827f5dd7599'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'actor_type'
                            value: 'ai'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c142ebe2c8e846c99969b32922f516a8'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'timestamp'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'c1652f65b56b4e3abd5e325a1bf1a1f6'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                        }
                    },
                    {
                        table: 'sys_choice_set'
                        id: 'c48ea21504c94c83bc43f67867526d7a'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'role'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c4ba6f960bc54d5693e32fc4a3e618b1'
                        key: {
                            sys_security_acl: '3da90d460b9b42a78eac4ca3a33bee0f'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'c630eecb1fcb45a1a306ee4c0b671a95'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'status'
                            value: 'open'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'c63f05dd78ee4e19bb55d1b5ec590fff'
                        key: {
                            sys_security_acl: '9701530b9de743b182eddf534d35c98b'
                            sys_user_role: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'c732015e1f764f0393aed4bf5fb99873'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'score_variance'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c832e2de43b147f7a8d2ad9173e444e4'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'category_distribution'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'c9b10519cc9040ceb1a245997bc6c4e0'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'caad84fe081349ae92e39c50d2f008df'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'category'
                            value: 'not_a_fit'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cb0be4b8da35426cb4f84a03f40b7141'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'cb2d5230ebec453ab195e172660a4339'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'cb5d64b05c774c449f79793fe4393d23'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'status'
                            value: 'completed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'cc18bcea057945e88fed17d676039134'
                        key: {
                            sys_security_acl: 'cb0dfd9c62b94406986c31332829d41a'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'cc3a0ec5dfb244b8a8b447519b27c75d'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'actor'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ce79a472799f4506913035dc82e9e88e'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'status'
                            value: 'decided'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ceeb78f569e045d28e8285af857939c6'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'scope'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ceef0beeeb154355a57bcc51848b288f'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'file_name'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'cfbfba3fedce4af181c729f02a5be916'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'status'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd0112ca1a84e44f8bf9bbf9e294eed95'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'details'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd0e21c9150c24cb8a91065081d36273e'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'd1a2093eb4ab484f81894cef38612562'
                        key: {
                            role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                            contains: {
                                id: '8287635526004c119ca1001fdc713f62'
                                key: {
                                    name: 'x_winu_hireme.hiring_manager'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd2239b5dac05452f97df1e3fe4ba3099'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'final_decision'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd3b3c7e6bde94ef2a755bfd5a18c3343'
                        key: {
                            sys_security_acl: '0ea9b57f0c284855b33a0718a15a6c13'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd3c625117e8f4b79bdf8cc27803fb42e'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'application_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_user_role_contains'
                        id: 'd51be588f61d4d33a80964eb3f781547'
                        key: {
                            role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                            contains: {
                                id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                                key: {
                                    name: 'x_winu_hireme.recruiter'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd7376250c45a453d9320fe364e6ce577'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'channel'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd7394661a1724c8e8741751ac481c875'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'skills'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd7ad2d94f3eb48f18386290cbab2c5ea'
                        key: {
                            sys_security_acl: '14a151958286420ca8d15cb18382c6fc'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'd7b4c508df20473c917cdfcbb6db5fdc'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd7fd1e17ba724a298230b04c9a3baeaa'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_error'
                            language: 'en'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'd8ef0eeef0cd4913aeaaaa61c2087d71'
                        key: {
                            name: 'x_winu_hireme_application'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'd96a4e95adae4157b0e617579d442ede'
                        key: {
                            sys_security_acl: '1cc0219231674dfea140d2f7bf117293'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'd9765d1bcc2e4af4bf864286b1ca0449'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'title'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'd9875a617829424caa45534ed9b68edb'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'd99c68f04cdb45da8223c6a5d5ba9707'
                        key: {
                            name: 'x_winu_hireme_audit_log'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'd9fb65cbcfef41f3916d10f7a1b0700f'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'error'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dafd4bb572e749f78f3d0ed564a9e747'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'score'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'dbef1908b8ed4ceb87cb7814f2098389'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'data_confidence'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'dcc0af785ad54ae4aa5ef2329af65e51'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'sla_compliance_rate'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'dec67ac632454a2e9112f2f53c3cd61c'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e074aece404440ed98b3e363310e6ea1'
                        key: {
                            sys_security_acl: '3da90d460b9b42a78eac4ca3a33bee0f'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_user_role'
                        id: 'e15ef9cb95c24d45a70ca6a6726a2f17'
                        key: {
                            name: 'x_winu_hireme.recruiter'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e1bd63d2c50c4c4892de40fedc3cdbbe'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'applications_total'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e227e77e277440d2892c60af9adc47e4'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'parser_version'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'e23f4b799d40484f867c571162ddd5d4'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e2a4f242bfd54cb09345512acd2f8c2d'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'interview_completion_rate'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e3589aca2659433fa11087a720bd826e'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'offer_conversion_rate'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e421db32f3d441aabaa57a44890b694e'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'is_current'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e61070fab93a41898cefcf459c1caa41'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'ai_subscore'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e6c80ea078414e1eb2f3708ef74d7949'
                        key: {
                            name: 'x_winu_hireme_application'
                            element: 'status'
                            value: 'closed'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'e74e38a1cbac40e48a480f946e66eba8'
                        key: {
                            name: 'x_winu_hireme_notification'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'e766b71400374697b1c27b70792bb4b3'
                        key: {
                            sys_security_acl: 'a061ecf89df9418d8a20e2d51bdeaa62'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e7851f368c2a494c8ced492d2b0adbbb'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'category'
                            value: 'top_match'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e8a3229a1fe444139a9d95b002cd2e31'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'channel'
                            value: 'teams'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'e8e8cb187c08400b85ca39aaa516c95d'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'channel'
                            value: 'push'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'e97f08317e27403e802e4db6cd85f207'
                        key: {
                            name: 'x_winu_hireme_candidate'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'e9978692b0d043d4848170a8453749bf'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'reviewed_by'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'eb7431e95bc1421782f376d13f920fda'
                        key: {
                            sys_security_acl: '893b0e0bb49645a08f1c1f8e37d6b008'
                            sys_user_role: {
                                id: '0e705ce4adfb4b61ba36a262227b2b4f'
                                key: {
                                    name: 'x_winu_hireme.integration'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ec7a3672cbe6415db0ce509b4d9d43e1'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'requirements'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ecca6d35d7064170bcc11d3616675163'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'ocr_success_rate'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'ece229e746d84b34a0083ac5651bc79a'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'NULL'
                        }
                    },
                    {
                        table: 'ua_table_licensing_config'
                        id: 'ed09891873364940bc635fab89884ed3'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'ededba8f33a94031976ebc5f3e10be4a'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'message'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'edf82df94d5a47a3bfc412f5d78452db'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'ee4951e757f1425c85e1b0b2004c7626'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'role'
                            value: 'assistant'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'eed540f959744a48b1b678600c639b14'
                        key: {
                            name: 'x_winu_hireme_candidate_profile'
                            element: 'application_ref'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'effe3ca771bd40cd9cea0c725a3b13e1'
                        key: {
                            sys_security_acl: '6e0e6a8596f84dda8ea4a08f14bdbb73'
                            sys_user_role: {
                                id: '8287635526004c119ca1001fdc713f62'
                                key: {
                                    name: 'x_winu_hireme.hiring_manager'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f19c63e620354ef4be8916fd779910cb'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'scored_at'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_db_object'
                        id: 'f23d49c1904f41088bc4183e34ba59b0'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f28e0093f69e41c0a563228e8af7682a'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'category'
                            value: 'potential'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f4d08af137c94540942f0588dbc092ed'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'avg_time_to_hire_days'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f51af3131c4a487a81e29f898f51c19a'
                        key: {
                            name: 'x_winu_hireme_job_offer'
                            element: 'title'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f5461497449e47a3830b2bef577557ae'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'status'
                            value: 'queued'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'f559e357f76741eaa06cd758867f896c'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_status'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'f74f3c6f5be04b8e89a6099e56b5df18'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'channel'
                            value: 'rh_copilot'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'f80ceeae2bb8415cb8a760a83cb7a5a9'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'NULL'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'f91987251b1e4f5a962a182a1cbb5019'
                        key: {
                            sys_security_acl: '8b77131122344293b76ee60fe20afbba'
                            sys_user_role: {
                                id: '8287635526004c119ca1001fdc713f62'
                                key: {
                                    name: 'x_winu_hireme.hiring_manager'
                                }
                            }
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fb421e8e37284fe9a5e88bebc1e8ef5b'
                        key: {
                            name: 'x_winu_hireme_chat_interaction'
                            element: 'actor'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fb4930b2cf0248a28324643dc38ac035'
                        key: {
                            name: 'x_winu_hireme_notification'
                            element: 'sent_date'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fbc7107d41494e48ab9e03c9f1cfdc75'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'invited_at'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fcd51bbdf1854866b6a8e88330727a36'
                        key: {
                            name: 'x_winu_hireme_interview_session'
                            element: 'status'
                            value: 'in_progress'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_documentation'
                        id: 'fdbe0184955147d8b3225f43a9d8f36d'
                        key: {
                            name: 'x_winu_hireme_kpi_snapshot'
                            element: 'avg_time_to_screen_hours'
                            language: 'en'
                        }
                    },
                    {
                        table: 'sys_dictionary'
                        id: 'fdc3c85c3ee34df791039281b11929ee'
                        key: {
                            name: 'x_winu_hireme_scoring_result'
                            element: 'application_ref'
                        }
                    },
                    {
                        table: 'sys_choice'
                        id: 'fdedd562545b47b8a36b5ca9034a26b3'
                        key: {
                            name: 'x_winu_hireme_cv_document'
                            element: 'ocr_status'
                            value: 'pending'
                            language: 'en'
                            dependent_value: 'NULL'
                        }
                    },
                    {
                        table: 'sys_security_acl_role'
                        id: 'ff0998b7896d4e26978b19b6f637952b'
                        key: {
                            sys_security_acl: 'bb36c9313df3458d8fcab3d748d239da'
                            sys_user_role: {
                                id: '01621851ff6647998e25aefb11bac949'
                                key: {
                                    name: 'x_winu_hireme.admin'
                                }
                            }
                        }
                    },
                ]
            }
        }
    }
}
