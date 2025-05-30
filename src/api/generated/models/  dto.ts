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
 * @interface   DTO
 */
export interface   DTO {
    /**
     * 카테고리
     * @type {string}
     * @memberof   DTO
     */
    'category'?: string;
    /**
     * 최소 가격(null => 전체 조회)
     * @type {number}
     * @memberof   DTO
     */
    'minPrice'?: number;
    /**
     * 최대 가격(null => 전체 조회)
     * @type {number}
     * @memberof   DTO
     */
    'maxPrice'?: number;
    /**
     * 판매상태
     * @type {boolean}
     * @memberof   DTO
     */
    'saleStatus'?: boolean;
    /**
     * 검색어(null => 전체 조회)
     * @type {string}
     * @memberof   DTO
     */
    'keyword'?: string;
    /**
     * 장소(null => 전체 조회)
     * @type {string}
     * @memberof   DTO
     */
    'place'?: string;
}

