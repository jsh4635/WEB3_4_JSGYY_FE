/* tslint:disable */
/* eslint-disable */
/**
 * 4차 프로젝트 7팀 API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: v1
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */



/**
 * 
 * @export
 * @interface Pageable
 */
export interface Pageable {
    /**
     * 
     * @type {number}
     * @memberof Pageable
     */
    'page'?: number;
    /**
     * 
     * @type {number}
     * @memberof Pageable
     */
    'size'?: number;
    /**
     * 
     * @type {Array<string>}
     * @memberof Pageable
     */
    'sort'?: Array<string>;
}

