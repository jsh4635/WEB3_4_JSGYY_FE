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
 * @interface    DTO
 */
export interface    DTO {
    /**
     *  게시글 ID
     * @type {number}
     * @memberof    DTO
     */
    'id'?: number;
    /**
     *  게시글 제목
     * @type {string}
     * @memberof    DTO
     */
    'title': string;
    /**
     *  게시글 내용
     * @type {string}
     * @memberof    DTO
     */
    'content': string;
    /**
     *  게시글 카테고리
     * @type {string}
     * @memberof    DTO
     */
    'category': string;
    /**
     *  장소
     * @type {string}
     * @memberof    DTO
     */
    'place': string;
    /**
     *  가격
     * @type {number}
     * @memberof    DTO
     */
    'price': number;
    /**
     *  거래 상태
     * @type {boolean}
     * @memberof    DTO
     */
    'saleStatus': boolean;
    /**
     *  경매 여부
     * @type {boolean}
     * @memberof    DTO
     */
    'auctionStatus': boolean;
    /**
     *  썸네일
     * @type {string}
     * @memberof    DTO
     */
    'thumbnail'?: string;
    /**
     * 작성일자
     * @type {string}
     * @memberof    DTO
     */
    'createdAt'?: string;
}

