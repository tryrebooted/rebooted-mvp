package rebootedmvp;

public interface Content extends HasID {

    /**
     * Different atomic units of content blocks. Each one is an implementation
     * of this interface
     */
    public enum ContentType {
        Text,
        Question
    }

    /**
     * Returns whether the task/object/question is complete or not
     */
    public boolean isComplete();

    /**
     * Returns the content of a content block
     */
    public Content getContent();

    /**
     * Returns the content type of the user
     */
    public ContentType getType();

    public String getTitle();

    public String getBody();

}
